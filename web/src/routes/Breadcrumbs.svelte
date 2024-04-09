<script lang="ts">
import { base } from "$app/paths";
import type { HierarchyEntry, HierarchyItem } from "$lib/files";

export let dir: HierarchyEntry | HierarchyItem;

$: trimmed = dir.path.replace(/\/$/, "");
$: parts = trimmed.split("/").slice(0, -1);

</script>

{#each parts as part, index}
    <a href={base}/{parts.slice(0, index + 1).join("/")}>{part}</a>
    {#if index < parts.length - 1}
    &nbsp;/&nbsp; 
    {/if}
{/each}