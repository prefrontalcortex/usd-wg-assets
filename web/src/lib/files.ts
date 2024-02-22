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

export function getFiles() {
    
    const directory = "/";
    const thisPath = import.meta.url.replace("file:///", "");
    const base = normalizePath(path.resolve(thisPath + "/../../../.." + directory) + "/");

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
            src: "images/" + path.dirname(relative) + "/" + path.basename(relative),
        });
    }

    globSync(base + "**/thumbnails/**.png").map(file => {
        const relativeToBase = normalizePath(path.relative(base, file));
        const assetName = relativeToBase.split("/")[0];
        const subassetName = relativeToBase.split("/thumbnails")[0].split("/").pop();
        addFileToHierarchy(assetName + "/" + subassetName, file);
    });

    return hierarchy;
}