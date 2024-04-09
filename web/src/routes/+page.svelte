<script lang="ts">
  import path from 'path';
import GridItem from './GridItem.svelte';
export let data;

</script>

<div>
{#each data.posts.children as child}
    <article>
        <GridItem child={child} depth={1}/>
    </article>
{/each}
</div>