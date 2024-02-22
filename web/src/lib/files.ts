import { globSync } from "glob";
import path from "path";
import { normalizePath } from "vite";

export class HierarchyItem {
    filename: string = "";
    absolute: string = "";
    src: string = "";
}

export class HierarchyEntry {
    name: string = "";
    children: HierarchyEntry[] = [];
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
    
    const hierarchy: HierarchyEntry = { name : "", children: [], items: [] };
    const addFileToHierarchy = (file: string, item: string) => {
        const parts = file.split("/");
        let current = hierarchy;
        for (const part of parts) {
            let found = current.children.find(child => child.name === part);
            if (!found) {
                found = { name: part, children: [], items: [] }
                current.children.push(found);
            }
            current = found;
        }

        const relative = normalizePath(path.relative(base, item));

        current.items.push({
            filename: path.basename(item),
            absolute: normalizePath(item),
            src: path.dirname(relative) + "/" + path.basename(relative),
        });
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