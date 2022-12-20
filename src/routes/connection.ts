import { writable } from "svelte/store";

// create a writable for the connected server
// this server is where we'll get the data from for the rest of our components
export const connectedServer = writable("None");

// create a variable to tell other components if it's okay to show their ui
// (it's not okay if there is no connectedServer)
export let allowedToShowUi: boolean = false;

connectedServer.subscribe((v) => {
	if (v !== "None" && v !== null) allowedToShowUi = true;
	else allowedToShowUi = false;
});
