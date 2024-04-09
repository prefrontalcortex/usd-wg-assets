<script lang="ts">
import { mode } from '$lib/settings';

</script>

<div class="header">
    <label>Hierarchy<input type="radio" name="mode" value="hierarchy" bind:group={$mode}/></label>
    <label>List<input type="radio" name="mode" value="list" bind:group={$mode}/></label>
    <label>Grid<input type="radio" name="mode" value="grid" bind:group={$mode}/></label>
</div>


<slot></slot>

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

div.header {
    margin-bottom: 1.0em;
}

div.header input {
    appearance: none;
    margin: 0;
}

div.header label {
    padding: 0.5em;
    margin-right: -0.4em;
    background-color: #fff;
    text-transform: uppercase;
    font-size: 0.7em;
    letter-spacing: 1px;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.1);
    color: #aaa;
}

div.header label:has(input:checked) {
    background-color: #eee;
    color: #333;
}

div.header label:first-child {
    border-top-left-radius: 3em;
    border-bottom-left-radius: 3em;
}

div.header label:last-child {
    border-top-right-radius: 3em;
    border-bottom-right-radius: 3em;
}

</style>