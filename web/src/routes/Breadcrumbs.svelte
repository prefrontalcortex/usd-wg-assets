<script lang="ts">
import { base } from "$app/paths";
import type { HierarchyEntry, HierarchyItem } from "$lib/files";

export let dir: HierarchyEntry | HierarchyItem;

$: trimmed = dir.path.replace(/\/$/, "");
$: parts = trimmed.split("/");

</script>

<a href={base}>all</a> &nbsp;/&nbsp;
{#each parts as part, index}
    <a class:last={index == parts.length - 1} href={base}/{parts.slice(0, index + 1).join("/")}>{part}</a>
    {#if index < parts.length - 1}
    &nbsp;/&nbsp; 
    {/if}
{/each}
{#if "ext" in dir}
    {dir.ext}
{/if}

<style>
a {
    color: gray;
    text-decoration: none;
}

a.last {
    font-weight: bold;
    color: black;
}
</style>