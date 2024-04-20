<script lang="ts">
import { base } from '$app/paths';

let container: HTMLDivElement;

function goFullscreen(event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement; }) {
  console.log("goFullscreen");
  const elem = document.body;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}
</script>

<svelte:head>
  <script type="text/javascript" async src="modules/es-module-shims@1.8.0.js"></script>
  <script type="importmap">
    {
      "imports": {
        "three": "https://unpkg.com/three@0.163.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.163.0/examples/jsm/"
      }
    }
  </script>
  <script type="module" src="https://unpkg.com/three@0.163.0/build/three.module.js"></script>
    <script src="{base}/viewer/emHdBindings.js" type="text/javascript"></script>
    <script type="module" src="{base}/viewer/index.js"></script>
</svelte:head>

<div id="container" bind:this={container}>
    <div class="buttons">
    {#if false}
    <a class="file" href="?file=">Clear<br/><span>Drop USDZ to load</span></a>

    <a class="filename"></a>
    {/if}
    
    <p id="message-log">
      Initializing...
    </p>

    <button><a id="export-gltf">Export as .glb</a></button>
    <button on:click={goFullscreen}>Fullscreen</button>
    <br/>
    </div>
    
</div>

{#if false}
<div class="footer">
  <a id="quick-look-link" rel="ar" href="#"><img width="128" height="128" src="ARKit_Glyph.svg" title="ARKit Glyph" style="max-width:100%; height:auto;"></a>
</div>
{/if}

<style>


div#container {
  position: absolute;
  bottom: 0;
  margin: 5px;
}

:global(body) {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  color: black;
}

#message-log {
  color: gray;
}

button {
  outline: 0;
  border: 0;
  background: #f8f8f8;
  padding: 0.5em;
  appearance: none;
  cursor: pointer;
  border-radius: 10px;
}

button:hover {
  background: #f0f0f0;
}
</style>