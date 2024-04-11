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
    <span on:click={() => expanded = !expanded} class="folder">
        <a href={base}/{child.path}>{child.name}</a>
        <span class="item-count">{child.totalChildren}</span>
    </span>
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

li.selected a {
    color: black;
    font-weight: bold;
}

.folder {
    white-space: nowrap;
}

</style>