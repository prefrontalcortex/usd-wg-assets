<script lang="ts">
import GridItem from './GridItem.svelte';
export let data;
</script>

<div>
{#each data.posts.children as child}
    <article>
        <GridItem child={child} />
    </article>
{/each}
</div>