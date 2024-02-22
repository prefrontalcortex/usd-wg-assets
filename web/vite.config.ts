import { HierarchyEntry, HierarchyItem, getFiles } from './src/lib/files.js';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy, type Target } from 'vite-plugin-static-copy';

export default defineConfig(() => {

	const hierarchy = getFiles();
	const childItems = new Array<HierarchyItem>();
	const addLevel = ((entry: HierarchyEntry) => {
		childItems.push(...entry.items);
		entry.children.forEach(child => addLevel(child));
	});
	addLevel(hierarchy);

	const copyTargets: Target[] = [];
	copyTargets.push(...childItems.flatMap(file => {
		const dest = path.dirname(file.src);
		return [
			{
				src: file.absolute,
				dest: dest,
			}
		]
	}));

	return {
		plugins: [
			sveltekit(),
			viteStaticCopy({ targets: copyTargets }),
		],
	}
});