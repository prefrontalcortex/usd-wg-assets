import { getFiles } from "$lib/files";

export const prerender = true;
export const ssr = true;
export const trailingSlash = 'always';

const posts = getFiles();

// console.log("rendering", posts);

export async function load() {

	return {
		posts: posts, 
        location: import.meta.url,
	};
}