<script lang="ts">
import GridItem from './../GridItem.svelte';

export let data;

</script>

<div>
{#each data.posts.children as child}
    <article class="grid">
        <GridItem child={child} depth={1} mode="grid"/>
    </article>
{/each}
</div>

<style>
article.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--image-size), 1fr));
    gap: 0.5em;
}
</style>