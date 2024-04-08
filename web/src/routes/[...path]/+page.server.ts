import { HierarchyEntry, getFiles } from '$lib/files.js';

const files = getFiles();

function getChilds() {
    const childItems = new Array<HierarchyEntry>();
    const addLevel = ((entry: HierarchyEntry) => {
		childItems.push(...entry.children);
		entry.children.forEach(child => addLevel(child));
	});
	addLevel(files);
    return childItems;
}

const mappedFiles = getChilds().map(file => {
    return {
        path: file.name,
    }
});

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {

    console.log(params.path);

    return {
        slug: params.path,
    }
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
    return mappedFiles;
}