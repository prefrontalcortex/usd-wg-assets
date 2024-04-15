<script lang="ts">
import { base } from '$app/paths';
import type { HierarchyEntry } from '$lib/files';
import { path } from '$lib/settings';

export let child: HierarchyEntry;
export let depth = 1;
export let mode: string = "grid";

let expanded = depth < 2;

$: expand = expanded || mode === "list" || $path.startsWith(child.path);
$: selected = $path.startsWith(child.path);

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
<li class:selected={selected}>
    <button on:click={() => expanded = !expanded} class="folder" tabindex="0">
        <a href={base}/{child.path}>{child.name}</a>
        <span class="item-count">{child.totalChildren}</span>
    </button>
</li>
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

a {
    color: gray;
    text-decoration: none;
}

div.container {
    display: flex;
    flex-direction: column;
    margin-left: 1em;
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
    opacity: 0.2;
}

li.selected a {
    color: black;
    font-weight: bold;
}

.folder {
    white-space: nowrap;
}

button.folder {
    appearance: none;
    outline: none;
    border: none;
    background-color: transparent;
    font-size: 14px;
}

</style>