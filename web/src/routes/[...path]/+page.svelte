<script lang="ts">
import { base } from '$app/paths';
import type { HierarchyEntry, HierarchyItem } from '$lib/files';
import { onMount } from 'svelte';
import GridItem from '../GridItem.svelte';
export let data;


/*
onMount(() => {
    dirs = getChilds();
    items = getItems();
});
*/

let dirs: HierarchyEntry[] = getChilds();
let items: HierarchyItem[] = getItems();

$: currentDir = dirs?.find(child => child.path === "/" + data.slug);
$: currentItem = items?.find(item => item.path === data.slug);
$: currentPath = currentItem ? currentItem.path : currentDir ? currentDir.path : "";

$: relativeUrl = currentItem ? base + "/" + currentItem.path + currentItem.ext : "";
$: absoluteUrl = window.location.origin + relativeUrl;

function getViewerUrl(abs: string) {
    const encoded = encodeURIComponent(abs);
    return "https://usd-viewer.glitch.me/?file=" + encoded;
}

$: absoluteGithubUrl = currentItem ? "https://github.com/usd-wg/assets/blob/main/" + currentItem.path + currentItem.ext : "";
</script>

<div>
<a href={base}>See all assets</a>
<p>{currentPath}</p>

{#if currentDir}
    <article>
        <GridItem child={currentDir} />
    </article>
{:else if currentItem}
    <article>

        <span>{currentItem.filename}</span>
        <br/>
        
        <a href={getViewerUrl(absoluteGithubUrl)} target="_blank" class="viewer-link">
            <img src={base}/{currentItem.src} alt="Thumbnail"/>  
            <span>Open in USD Viewer</span>
        </a>
        <a href={absoluteGithubUrl} target="_blank">View file on GitHub</a>
        
        <!--

        <a href={relativeUrl} download>Download</a>
        <a href={getViewerUrl(absoluteUrl)} target="_blank">View in USD Viewer (local file)</a>
        <iframe src="https://usd-viewer.glitch.me/?file={absoluteUrl}" sandbox="allow-scripts allow-same-origin"></iframe>
        
        -->
    </article>
{:else}
<code><pre>
{data.slug}
-----
{JSON.stringify(data.posts.children, null, 2)}
-----
{JSON.stringify(data, null, 2)}
</pre></code>
{/if}
</div>

<style>
article {
    display: flex;
    flex-direction: column;
    align-items: center;
}

p {
    opacity: 0.5;
    font-size: 0.7em;
}

a.viewer-link {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>