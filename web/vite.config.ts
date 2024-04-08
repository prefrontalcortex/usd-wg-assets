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
		const destParent = path.dirname(file.path);
		return [
			{
				src: file.absolute,
				dest: dest,
			},
			{
				src: file.absoluteUsd,
				dest: destParent,
			},
		]
	}));

	return {
		plugins: [
			viteStaticCopy({ targets: copyTargets, structured: false }),
			sveltekit(),
		],
		server: {
			headers: {
				// allow SharedArrayBuffers
				'Cross-Origin-Opener-Policy': 'same-origin',
				'Cross-Origin-Embedder-Policy': 'credentialless',
			},
		},
	}
});
