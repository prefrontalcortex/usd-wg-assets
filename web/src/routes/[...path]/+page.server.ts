import { HierarchyEntry, HierarchyItem, getFiles } from '$lib/files.js';

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

    const path = params.path;

    const currentDir = dirs?.find(child => child.path === path || child.path === path + "/");
    const currentItem = items?.find(item => item.path === path || item.path + "/" === path);

    // console.log("Loading page: " + path + ", currentDir: " + currentDir + ", currentItem: " + currentItem);

    return {
        slug: path,
        currentDir: currentDir,
        currentItem: currentItem,
    }
}


/** @type {import('./$types').EntryGenerator} */
//export function entries() {
//    console.log("Generating entries", mappedFiles);
//    return mappedFiles;
//}