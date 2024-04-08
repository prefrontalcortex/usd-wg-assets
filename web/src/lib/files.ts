import { globSync } from "glob";
import path from "path";
import { normalizePath } from "vite";

export class HierarchyItem {
    filename: string = "";
    absolute: string = "";
    absoluteUsd: string = "";
    src: string = "";
    path: string = "";
}

export class HierarchyEntry {
    name: string = "";
    path: string = "";
    children: HierarchyEntry[] = [];
    totalChildren: number = 0;
    items: Array<HierarchyItem> = [];
}

let vari = 0;
export function getFiles() {
    
    // walk up from import.meta.url until we find a package.json in the parent directory
    const findPackageJson = (dir: string): string => {
        const parent = path.resolve(dir, "..");
        if (parent === dir) {
            throw new Error("Could not find package.json");
        }
        if (globSync(path.join(parent, "package.json")).length) {
            return parent;
        }
        return findPackageJson(parent);
    }

    const directory = "";
    const projectDirectory = findPackageJson(import.meta.url);
    const base = normalizePath(path.resolve(projectDirectory + "/../" + directory) + "/");
    
    const hierarchy: HierarchyEntry = { name : "", children: [], items: [], totalChildren: 0, path: "" };
    const addFileToHierarchy = (file: string, item: string) => {
        const parts = file.split("/");
        let current = hierarchy;
        for (const part of parts) {
            let found = current.children.find(child => child.name === part);
            if (!found) {
                found = { name: part, children: [], items: [], totalChildren: 0, path: current.path + "/" + part};
                current.children.push(found);
            }
            current = found;
            current.totalChildren++;
        }

        const relative = normalizePath(path.relative(base, item));
        const filename = path.basename(item);
        // without ext
        const name = path.basename(item, path.extname(item));
        const absolute = normalizePath(item);
        // walk two directories up, so we're next to "thumbnails"
        const pathWithUsdFiles = normalizePath(path.resolve(item, "..", ".."));
        const allowedExtensions = [".usd", ".usda", ".usdc", ".usdz"];
        const usdFiles = globSync(pathWithUsdFiles + "/" + name + ".*").filter(file => {
            const ext = path.extname(file);
            return allowedExtensions.includes(ext);
        });
        const firstUsdFile = usdFiles.length > 0 ? usdFiles[0] : "";
        
        current.items.push({
            filename: name,
            absolute: absolute,
            absoluteUsd: firstUsdFile,
            src: path.dirname(relative) + "/" + path.basename(relative),
            path: current.path + "/" + path.basename(firstUsdFile),
        });

        // log last item
        console.log(current.items[current.items.length - 1]);
    }

    const collectFiles = (directory: string) => {
        globSync(base + directory + "**/thumbnails/**.png").map(file => {
            const relativeToBase = normalizePath(path.relative(base, file));
            const assetName = relativeToBase.split("/")[0];
            const subassetName = relativeToBase.split("/thumbnails")[0].split("/").pop();
            addFileToHierarchy(assetName + "/" + subassetName, file);
        });
    }

    collectFiles("test_assets/");
    collectFiles("full_assets/");

    return hierarchy;
}