<script lang="ts">
import { base } from '$app/paths';
import type { HierarchyEntry } from '$lib/files';

export let child: HierarchyEntry;
export let depth = 1;
export let mode: string = "grid";

let expanded = depth < 2;

$: expand = expanded || mode === "list";

</script>

{#if mode == "grid"}

{#if child.items}
    {#each child.items as item}
    <a href={base}/{item.path}>
        <div class="content">
            <img src={base}/{item.src} alt="Thumbnail"/>
            <span>{item.filename}</span>
        </div>
    </a>
    {/each}

    {#each child.children as grandchild}
    <svelte:self child={grandchild} depth={depth+1} mode={mode}/>
    {/each}
{/if}

{:else}
<div class="container">
{#if child.name}
<li>
    <span on:click={() => expanded = !expanded}>
        <a href={base}/{child.path}>{child.name}</a>
        <span class="item-count">{child.totalChildren}</span>
    </span>
</li>
{/if}

{#if child.items && expand && false}
<div class="grid content">
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

{#if child.children && expand}
<ul>
    {#each child.children as grandchild}
    <svelte:self child={grandchild} depth={depth+1} mode={mode}/>
    {/each}
</ul>
{/if}
</div>
{/if}

<style>

:root {
    --image-size: 128px;
}

div.container {
    display: flex;
    flex-direction: column;
    margin-left: 1em;
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

.content span {
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