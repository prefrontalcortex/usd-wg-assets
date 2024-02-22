<script lang="ts">
import { base } from '$app/paths';
import type { HierarchyEntry } from '$lib/files';

export let child: HierarchyEntry;

function stripFileExtension(filename: string) {
    return filename.split('.').slice(0, -1).join('.');
}

</script>

{#if child.name}
<h2><a href={base}/{child.name}>{child.name}</a></h2>
{/if}

{#if child.items}
<div class="grid">
    {#each child.items as item}
    <div>
        <img src="{base}/{item.src}" alt="Thumbnail"/>
        <span>{stripFileExtension(item.filename)}</span>
    </div>
    {/each}
</div>
{/if}
{#if child.children}
    {#each child.children as grandchild}
    <svelte:self child={grandchild}/>
    {/each}
{/if}

<style>
div.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1em;
}

div.grid > div img {
    outline: 1px solid #cccccc34;
}

img {
    width: 200px;
}

.grid span {
    display: block;
    text-align: center;
}

</style>