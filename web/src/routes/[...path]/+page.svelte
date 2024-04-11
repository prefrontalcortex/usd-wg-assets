<script lang="ts">
import { base } from '$app/paths';
import GridItem from '../GridItem.svelte';
import Breadcrumbs from '../Breadcrumbs.svelte';
import { path } from '$lib/settings';
export let data;

function getViewerUrl(abs: string) {
    const encoded = encodeURIComponent(abs);
    return "https://usd-viewer.glitch.me/?file=" + encoded;
}

$: absoluteGithubUrl = data.currentItem ? "https://github.com/usd-wg/assets/blob/main/" + data.currentItem.path + data.currentItem.ext : "";
$: $path = data.slug + "/";
$: dir = (data.currentDir?.items?.length != 1 ? data.currentDir : null);
$: item = data.currentItem || (data.currentDir?.items.length == 1 ? data.currentDir.items[0] : null);

</script>

<div>

<!--
<a href={base}>See all assets</a><br/>
-->

{#if dir}
    <Breadcrumbs dir={dir} />
    <article class="grid">
        <GridItem child={dir} mode="grid"/>
    </article>
{:else if item}
    <Breadcrumbs dir={item} />
    <article>
        <div>
            <a href={getViewerUrl(absoluteGithubUrl)} target="_blank" class="viewer-link">
                <img src={base}/{item.src} alt="Automatically generated Thumbnail"/>  
                <span>Open in web-based USD Viewer</span>
            </a>
            <a href={absoluteGithubUrl} target="_blank">View {item.filename}{item.ext} on GitHub</a><br/>
            {#if data.usdText}
            <a href="#code">View USD code</a>
            {/if}
        </div>
        
        <!--

        <a href={relativeUrl} download>Download</a>
        <a href={getViewerUrl(absoluteUrl)} target="_blank">View in USD Viewer (local file)</a>
        <iframe src="https://usd-viewer.glitch.me/?file={absoluteUrl}" sandbox="allow-scripts allow-same-origin"></iframe>
        
        -->
    </article>
{:else}
<p>Something went wrong, please report a bug with this URL and where you came from. Thanks!</p>
{/if}

{@html data.readmeMarkdown}

<br/>
<a href={data.absoluteReadmeUrl} target="_blank">Edit this page</a>

{#if data.usdText}
<h2 id="code">{data.currentItem.filename}{data.currentItem.ext}</h2>
<code><pre>{@html data.usdText}</pre></code>
{/if}

</div>

<style>
article {
    display: flex;
    flex-direction: column;
    margin-bottom: 2em;
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

a.viewer-link img {
    border: 1px solid transparent;
    margin: 0.5em 0em;
}

a.viewer-link:hover img {
    background-color: white;
    border: 1px solid rgb(235, 235, 235);
}

article.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--image-size), 1fr));
    gap: 0.5em;
}

code {
    white-space: pre-wrap;
    font-size: 0.9em;
}

</style>