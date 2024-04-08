<script lang="ts">
import { base } from '$app/paths';
import type { HierarchyEntry, HierarchyItem } from '$lib/files';
  import { onMount } from 'svelte';
import GridItem from '../GridItem.svelte';
export let data;

function getChilds() {
    const childItems = new Array<HierarchyEntry>();
    const addLevel = ((entry: HierarchyEntry) => {
		childItems.push(...entry.children);
		entry.children.forEach(child => addLevel(child));
	});
	addLevel(data.posts);
    return childItems;
}

function getItems() {
    const items = new Array<HierarchyItem>();
    const addLevel = ((entry: HierarchyEntry) => {
        items.push(...entry.items);
        entry.children.forEach(child => addLevel(child));
    });
    addLevel(data.posts);
    return items;
}

onMount(() => {
    dirs = getChilds();
    items = getItems();
});

let dirs: HierarchyEntry[];
let items: HierarchyItem[];

$: currentDir = dirs?.find(child => child.path === "/" + data.slug);
$: currentItem = items?.find(item => item.path === "/" + data.slug);

</script>

<div>
<a href={base}>See all assets</a>
<p>{data.slug} --- {currentDir?.path}</p>

{#if currentDir}
    <article>
        <GridItem child={currentDir} />
    </article>
{:else if currentItem}
    <article>
        <p>{JSON.stringify(currentItem, null, 2)}</p>
        <a href={base}{currentItem.path}>Download</a>
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