<script lang="ts">
import { base } from '$app/paths';
import GridItem from '../GridItem.svelte';
import Breadcrumbs from '../Breadcrumbs.svelte';
  import { mode } from '$lib/settings';
export let data;

$: currentPath = data.currentItem ? data.currentItem.path : data.currentDir ? data.currentDir.path : "";
$: relativeUrl = data.currentItem ? base + "/" + data.currentItem.path + data.currentItem.ext : "";

function getViewerUrl(abs: string) {
    const encoded = encodeURIComponent(abs);
    return "https://usd-viewer.glitch.me/?file=" + encoded;
}

$: absoluteGithubUrl = data.currentItem ? "https://github.com/usd-wg/assets/blob/main/" + data.currentItem.path + data.currentItem.ext : "";
</script>

<div class:grid={$mode == "grid"}>
<a href={base}>See all assets</a><br/>

{#if data.currentDir}
    <Breadcrumbs dir={data.currentDir} />
    <article>
        <GridItem child={data.currentDir} />
    </article>
{:else if data.currentItem}
    <Breadcrumbs dir={data.currentItem} />
    <article>

        <span>{data.currentItem.filename}</span>
        <br/>
        
        <a href={getViewerUrl(absoluteGithubUrl)} target="_blank" class="viewer-link">
            <img src={base}/{data.currentItem.src} alt="Thumbnail"/>  
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
}

p {
    opacity: 0.5;
    font-size: 0.7em;
}

a.viewer-link {
    display: flex;
    flex-direction: column;
    align-items: start;
}

.grid article {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--image-size), 1fr));
    gap: 0.5em;
}

</style>