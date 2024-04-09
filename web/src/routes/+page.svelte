<script lang="ts">
  import { mode } from '$lib/settings';
import GridItem from './GridItem.svelte';
export let data;

</script>

<div class:grid={$mode == "grid"}>
{#each data.posts.children as child}
    <article>
        <GridItem child={child} depth={1}/>
    </article>
{/each}
</div>

<style>

.grid article {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--image-size), 1fr));
    gap: 0.5em;
}

</style>