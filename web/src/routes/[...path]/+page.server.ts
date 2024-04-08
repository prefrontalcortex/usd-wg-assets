import { HierarchyEntry, HierarchyItem, getFiles } from '$lib/files.js';

const files = getFiles();
const dirs = getChilds();
const items = getItems();

const mappedFiles = getChilds().map(file => {
    return {
        path: file.name,
    }
});


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

    const currentDir = dirs?.find(child => child.path + "/" === "/" + path);
    const currentItem = items?.find(item => item.path + "/" === path);

    console.log("Loading page: " + path + ", currentDir: " + currentDir + ", currentItem: " + currentItem);

    return {
        slug: path,
    }
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
    return mappedFiles;
}