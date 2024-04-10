import { HierarchyEntry, HierarchyItem, getFiles } from '$lib/files.js';
import fs from 'fs';
import path from 'path';

const files = getFiles();
const dirs = getChilds();
const items = getItems();

const mappedFiles = getChilds().map(file => {
    // trim leading and trailing /
    let path = file.path;
    if (path.startsWith("/")) {
        path = path.substring(1);
    }
    if (path.endsWith("/")) {
        path = path.substring(0, path.length - 1);
    }
    return {
        path: path,
    }
}).concat(getItems().map(item => {
    // trim leading and trailing /
    let path = item.path;
    if (path.startsWith("/")) {
        path = path.substring(1);
    }
    if (path.endsWith("/")) {
        path = path.substring(0, path.length - 1);
    }
    return {
        path: path,
    }
}));


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

    const _path = params.path;

    const currentDir = dirs?.find(child => child.path === _path || child.path === _path + "/");
    const currentItem = items?.find(item => item.path === _path || item.path + "/" === _path);

    // console.log("Loading page: " + path + ", currentDir: " + currentDir + ", currentItem: " + currentItem);

    // check if currentItem is a text file, pass it along if that is the case
    let usdText: string | undefined = undefined;
    let readmeMarkdown: string | undefined = undefined;


    const findReadme = (dir: string): string | undefined => {
        const readmeFile = path.resolve(dir, "README.md");
        console.log("checking ", readmeFile)
        if (fs.existsSync(readmeFile)) {
            return readmeFile;
        }
        const parent = path.resolve(dir, "..");
        if (parent === dir) {
            return undefined;
        }
        return findReadme(parent);
    }

    if (currentItem) {
        usdText = fs.readFileSync(currentItem.absoluteUsd, 'utf8');
        // check first character is #, space, or (
        if (usdText.length > 0) {
            const firstChar = usdText[0];
            if (firstChar !== "#" && firstChar !== " " && firstChar !== "(") {
                usdText = undefined;
            }
        }

        // check if we find a suitable readme
        // start with directory where the usd file is located
        let readmePath = currentItem.absoluteUsd;
        readmePath = path.dirname(readmePath);

        // check if we have a README.md file
        const readmeFile = findReadme(readmePath);
        if (readmeFile) {
            readmeMarkdown = fs.readFileSync(readmeFile, 'utf8');
        }
    }
    else if (currentDir) {
        // check if we have a README.md file
        const readmeFile = findReadme(currentDir.path);
        if (readmeFile) {
            readmeMarkdown = fs.readFileSync(readmeFile, 'utf8');
        }
    }

    return {
        slug: _path,
        currentDir: currentDir,
        currentItem: currentItem,
        usdText: usdText,
        readmeMarkdown: readmeMarkdown,
    }
}


/** @type {import('./$types').EntryGenerator} */
//export function entries() {
//    console.log("Generating entries", mappedFiles);
//    return mappedFiles;
//}