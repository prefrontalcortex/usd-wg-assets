<script lang="ts">
import { base } from '$app/paths';
import type { HierarchyEntry } from '$lib/files';

export let child: HierarchyEntry;
export let depth = 1;

let opened = false;

function stripFileExtension(filename: string) {
    return filename.split('.').slice(0, -1).join('.');
}

</script>

<div class="container">
{#if child.name}
<svelte:element this={"h" + depth}><a href={base}{child.path}>{child.name}</a><span class="item-count">{child.totalChildren}</span></svelte:element>
{/if}

{#if child.items}
<div class="grid">
    {#each child.items as item}
    <a href={base}{item.path}>
        <div>
            <img src={base}/{item.src} alt="Thumbnail"/>
            <span>{item.filename}</span>
        </div>
    </a>
    {/each}
</div>
{/if}
{#if child.children}
    {#each child.children as grandchild}
    <svelte:self child={grandchild} depth={depth+1}/>
    {/each}
{/if}
</div>

<style>

:root {
    --image-size: 64px;
}

div.container {
    display: flex;
    flex-direction: column;
}

div.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--image-size), 1fr));
    gap: 0.5em;
}

div.grid > div img {
    outline: 1px solid #cccccc34;
}

img {
    width: var(--image-size);
}

.grid span {
    display: block;
    text-align: center;
    font-size: 0.85em;
    overflow: hidden;
    text-overflow: ellipsis;
}

span.item-count {
    margin-left: 0.5em;
}

</style>