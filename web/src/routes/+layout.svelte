<script lang="ts">
import { mode } from '$lib/settings';
import GridItem from './GridItem.svelte';

export let data;

</script>
<!--
<div class="header">
    <label>Hierarchy<input type="radio" name="mode" value="hierarchy" bind:group={$mode}/></label>
    <label>List<input type="radio" name="mode" value="list" bind:group={$mode}/></label>
    <label>Grid<input type="radio" name="mode" value="grid" bind:group={$mode}/></label>
</div>
-->

<div class="align">
    <div class="hierarchy-header">
        <GridItem child={data.posts} mode="hierarchy" />
    </div>

    <div class="page">
        <slot></slot>
    </div>
</div>
<div class="footer">
    <p>Data from <a href="https://github.com/usd-wg/assets" target="_blank">usd-wg/assets</a></p>
    <p>
        Made by <a href="https://twitter.com/hybridherbst" target="_blank">@hybridherbst</a> 
        from <a href="https://needle.tools" target="_blank">Needle</a> 
        and <a href="https://prefrontalcortex.de" target="_blank">prefrontal cortex</a></p>
</div>

<style>

div.footer {
    margin-top: 2em;
}

p {
    padding: 0;
    margin: 0;
    color: rgba(0, 0, 0, 0.3);
}

div.align {
    display: flex;
    justify-content: flex-start;
}

.hierarchy-header {
    position: sticky;
    top: 0;
    max-width: 400px;
    flex: auto;
    overflow-x: auto;
}

div.page {
    flex: 1;
    margin-left: 1em;
    max-width: 1200px;
}

</style>