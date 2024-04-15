import { HierarchyEntry, HierarchyItem, getFiles } from '$lib/files.js';
import usdLang from '$lib/usd.tmLanguage.json';
import fs from 'fs';
import path from 'path';
import { compile } from 'mdsvex';
import { getHighlighter } from 'shiki';
import remarkGfm from 'remark-gfm';
import { unzipSync } from 'fflate';

const files = getFiles();
const dirs = getChilds();
const items = getItems();

function getChilds() {
    const childItems = new Array<HierarchyEntry>();
    const addLevel = ((entry: HierarchyEntry) => {
		childItems.push(...entry.children);
		entry.children.forEach(child => addLevel(child));
	});
	addLevel(files);
    return childItems;
}

function getItems() {
    const items = new Array<HierarchyItem>();
    const addLevel = ((entry: HierarchyEntry) => {
        items.push(...entry.items);
        entry.children.forEach(child => addLevel(child));
    });
    addLevel(files);
    return items;
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {

    const theme = "slack-ochin"; // "catppuccin-latte";
    // usdLang from https://github.com/AnimalLogic/AL_usd_vscode_extension/blob/master/syntaxes/usd.tmLanguage.json
    const highlighter = await getHighlighter({ langs: ['javascript', 'python', usdLang], themes: [theme]});

    let _path = params.path;
    if (_path.endsWith("/")) _path = _path.substring(0, _path.length - 1);

    const currentDir = dirs?.find(child => child.path === _path || child.path === _path + "/");
    const currentItem = items?.find(item => item.path === _path || item.path + "/" === _path);

    // console.log("Loading page: " + path + ", currentDir: " + currentDir + ", currentItem: " + currentItem);

    // check if currentItem is a text file, pass it along if that is the case
    let usdText: string | undefined = undefined;
    let readmeMarkdown: string | undefined = undefined;
    let readmeUrl: string | undefined = undefined;

    const findReadme = (dir: string): string | undefined => {
        const files = fs.readdirSync(dir);
        if (files.includes("README.md")) return path.resolve(dir, "README.md");
        if (files.includes("readme.md")) return path.resolve(dir, "readme.md");
        if (files.includes("README")) return path.resolve(dir, "README");
        if (files.includes("readme")) return path.resolve(dir, "readme");
        if (files.includes("Readme.md")) return path.resolve(dir, "Readme.md");
        if (files.includes("README.MD")) return path.resolve(dir, "README.md");
        
        const parent = path.resolve(dir, "..");
        if (parent === dir) {
            return undefined;
        }
        return findReadme(parent);
    }

    const sanitizeUsda = (text: string) => {
        // in this text, find all long lines (longer than 200 chars)
        const lines = text.split("\n");
        const maxLen = 100;
        for (let l = 0; l < lines.length; l++) {
            let line = lines[l];
            if (line.length > maxLen && (line.includes("= [") || line.includes("=["))) {
                line = line.substring(0, maxLen) + "... (truncated)]";
            }
            lines[l] = line;
        } 
        text = lines.join("\n");

        // if (text.length > 10000) text = text.substring(0, 10000) + "...";

        return text;
    };

    if (currentItem) {
        usdText = fs.readFileSync(currentItem.absoluteUsd, 'utf8');
        const data = new Uint8Array(fs.readFileSync(currentItem.absoluteUsd, null).buffer);

        const byteSizeReadable = (bytes: number) => {
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return '0 Byte';
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
        }

        const isAscii = (firstChar: string) => {
            return firstChar === "#" || firstChar === " " || firstChar === "(";
        }

        // check first character is #, space, or ( so we don't display binary data
        if (usdText.length > 0) {
            
            const firstChar = usdText[0];
            const secondChar = usdText[1];

            const unpackUsdz = true; // for faster local testing

            // check if we have a compressed file
            if (unpackUsdz && firstChar == "P" && secondChar == "K") {
                try {
                    const decompressed = unzipSync(data);
                    const firstKey = Object.keys(decompressed)[0];
                    const decompressedData = decompressed[firstKey];
                    let text = new TextDecoder().decode(decompressedData);

                    const firstChar = text[0];

                    if (isAscii(firstChar))
                    {
                        usdText = sanitizeUsda(text);
                    }
                    else {
                        usdText = "";
                    }

                    // append USD file hierarchy
                    const files = Object.keys(decompressed);
                    usdText += "# USDZ File Hierarchy\n";
                    usdText += files.map(file => "- " + file + " (" + byteSizeReadable(decompressed[file].length) + ")").join("\n");
                }
                catch (e) {
                    console.error("Error decompressing file " + currentItem.absoluteUsd, e);
                    usdText = undefined;
                }
            }             
            else if (!isAscii(firstChar)) {
                usdText = undefined;
            }
            else {
                usdText = sanitizeUsda(usdText);
            }
        }

        if (usdText) {
            const html = await highlighter.codeToHtml(usdText, {
                lang: 'USD',
                theme: theme
            });
            usdText = html;
        }
        
        // check if we find a suitable readme
        // start with directory where the usd file is located
        let readmePath = currentItem.absoluteUsd;
        readmePath = path.dirname(readmePath);

        // check if we have a README.md file
        const readmeFile = findReadme(readmePath);
        if (readmeFile) {
            const relative = path.relative(path.resolve(".."), readmeFile);
            readmeUrl = "https://github.com/usd-wg/assets/blob/main/" + relative;
            readmeMarkdown = fs.readFileSync(readmeFile, 'utf8');
        }
    }
    else if (currentDir) {
        // check if we have a README.md file
        const root = path.resolve(".."); 
        const readmeFile = findReadme(path.resolve(root, currentDir.path));
        if (readmeFile) {
            const relative = path.relative(path.resolve(".."), readmeFile);
            readmeUrl = "https://github.com/usd-wg/assets/blob/main/" + relative;
            readmeMarkdown = fs.readFileSync(readmeFile, 'utf8');
        }
    }

    let dir = readmeUrl ? path.dirname(readmeUrl).replace(/\\/g, "/") : undefined;

    const visit = (node, file) => {
        if (node.type === 'html') {
            // replace src in img that does not start with http with dir + src
            // example: <a rel="ar"><img src="screenshots/20220604-screenshot.png"/></a>
            const match = node.value.match(/<img src="([^"]+)"/);
            if (match) {
                const src = match[1];
                if (src.startsWith("http")) return;
                node.value = node.value.replace(src, dir + "/" + src + "?raw=true");
            }
            // also replace a href
            const match2 = node.value.match(/<a href="([^"]+)"/);
            if (match2) {
                const src = match2[1];
                if (src.startsWith("http")) return;
                node.value = node.value.replace(src, dir + "/" + src);
            }
        }
        if (node.type === 'image') {
            if (node.url.startsWith("http")) return;
            const prev = node.url;
            node.url = dir + "/" + node.url + "?raw=true";

            // console.log("Image", prev, node.url);
        }
        if (node.type === 'link') {
            if (!node.url.startsWith("http"))
                node.url = dir + "/" + node.url;
            // TODO replace with video if it ends with .mp4 or is a YouTube link
            // if (node.url.endsWith(".mp4")) node.type = "video";
        }
        if (node.type === 'code') {
            // console.log("Code node", node);
        }
        for (const child of node.children || []) 
            visit(child, file);
    }

    const visit2 = async (node, file) => {	  
        // console.log(node.type + ", " + node.parent?.tagName);  	
        if (node.tagName == 'code') {  
            // console.log(node);
            
            // if (!node.value.startsWith('<pre')) return;

            let lang = "USD";
            if (node.properties?.className)
                lang = node.properties.className[0].split("-")[1];
            if (lang == "usda") lang = "USD";
            if (lang == "usd") lang = "USD";

            let value = node.children[0].value;

            // strip weird stuff
            const start = '<pre class="language-undefined">{@html `<code class="language-undefined">';
            if (value.startsWith(start)) {
                lang = "USD";
                value = value.substring(start.length);
            }
            const start2 = '<pre class="language-usda">{@html `<code class="language-usda">';
            if (value.startsWith(start2)) {
                lang = "USD";
                value = value.substring(start2.length);
            }
            const start3 = '<pre class="language-python">{@html `<code class="language-python">';
            if (value.startsWith(start3)) {
                lang = "python";
                value = value.substring(start3.length);
            }
            const end = '</code>`}</pre>';
            if (value.endsWith(end)) {
                value = value.substring(0, value.length - end.length);
            }
            value = value.replaceAll("&quot;", "\"");
            value = value.replaceAll("&lt;", "<");
            value = value.replaceAll("&gt;", ">");
            value = value.replaceAll("&amp;", "&");
            value = value.replaceAll("&nbsp;", " ");
            value = value.replaceAll("&copy;", "©");
            value = value.replaceAll("&#96;", "`");
            value = value.replaceAll("&#39;", "'");
            value = value.replaceAll("&#123;", "{");
            value = value.replaceAll("&#125;", "}");

            const hasLineBreaks = value.includes("\n");

            if (!hasLineBreaks) {
                return;
            }

            const html = await highlighter.codeToHtml(value, {
                lang: lang,
                theme: theme
            });
            
            node.tagName = "div";
            node.children = [{ type: 'text', value: html }];

            // console.log(node);
            return;
        }
        for (const child of node.children || []) 
            await visit2(child, file);
    }

    let code: string | undefined = undefined;
    if (readmeMarkdown) {
        code = (await compile(readmeMarkdown, { 
            highlight: false,
            remarkPlugins: [
                () => async (tree, file)  => {
                    visit(tree, file);
                },
                remarkGfm,
            ],
            rehypePlugins: [
                () => async (tree, file)  => {
                    await visit2(tree, file);
                }
            ]
        }))?.code;
    }

    // if (_path.includes("King"))
    //     console.log(currentItem, currentItem?.path + currentItem?.ext, items.filter(item => item.path.includes("King")).map(item => item.path + item.ext), _path);

    return {
        slug: _path,
        currentDir: currentDir,
        currentItem: currentItem,
        usdText: usdText,
        readmeMarkdown: code,
        absoluteReadmeUrl: readmeUrl,
    }
}