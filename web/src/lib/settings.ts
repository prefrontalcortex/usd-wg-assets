import { writable } from "svelte/store";

export let mode = writable("hierarchy");
export let path = writable("");