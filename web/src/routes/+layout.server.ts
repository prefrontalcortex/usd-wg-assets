import { getFiles } from "$lib/files";

export const prerender = true;
const posts = getFiles();

export async function load() {

	return {
		posts: posts, 
        location: import.meta.url,
	};
}