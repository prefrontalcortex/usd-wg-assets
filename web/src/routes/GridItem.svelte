<script lang="ts">
import { base } from '$app/paths';
import type { HierarchyEntry } from '$lib/files';

export let child: HierarchyEntry;
export let depth = 1;

let expanded = depth < 2;

</script>

<div class="container">
{#if child.name}
<div class="row">
    <input type="checkbox" bind:checked={expanded} />
    <svelte:element this={"h" + depth}><a href={base}/{child.path}>{child.name}</a><span class="item-count">{child.totalChildren}</span></svelte:element>
</div>
{/if}

{#if child.items && expanded}
<div class="grid">
    {#each child.items as item}
    <a href={base}/{item.path}>
        <div>
            <img src={base}/{item.src} alt="Thumbnail"/>
            <span>{item.filename}</span>
        </div>
    </a>
    {/each}
</div>
{/if}
{#if child.children && expanded}
    {#each child.children as grandchild}
    <svelte:self child={grandchild} depth={depth+1}/>
    {/each}
{/if}
</div>

<style>

:root {
    --image-size: 128px;
}

div.container {
    display: flex;
    flex-direction: column;
    margin-left: 2em;
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

div.row {
    display: flex;
    align-items: center;
}

input[type="checkbox"] {
    width: 1em;
    height: 1em;
    margin-right: 0.5em;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 0.1em;
    cursor: pointer;
    appearance: none;
}

input[type="checkbox"]:checked {
    background-color: rgba(0,0,0,0.2);
}
</style>