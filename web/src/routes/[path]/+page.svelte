<script lang="ts">
import type { HierarchyEntry } from '$lib/files';
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

$: current = getChilds().find(child => child.name === data.slug);

</script>

<div>
<a href="/">See all assets</a>

{#if current}
    <article>
        <GridItem child={current} />
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