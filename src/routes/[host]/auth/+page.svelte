<script lang="ts">
	import PocketBase from "pocketbase";

	import Nav from "$lib/nav.svelte";
	import type { PageData } from "./$types";
	import { onMount } from "svelte";

	export let data: PageData;
	// @ts-ignore because they ruined sveltekit
	export const { host } = data;

	// create pb client
	const pb = new PocketBase(`http://${host}`);

	// handle form submit
	let errorMessage = "";

	// login function
	async function login(e: any) {
		try {
			const authData = await pb
				.collection("users")
				.authWithPassword(e.target.username.value, e.target.password.value);

			window.location.href = `/${host}/`;
		} catch (err: any) {
			errorMessage = err;
		}
	}

	// signup function
	async function signup(e: any) {
		try {
			const data = {
				username: e.target.username.value,
				password: e.target.password.value,
				passwordConfirm: e.target.password.value
			};

			await pb.collection("users").create(data);
			await login(e);
		} catch (err: any) {
			errorMessage = err;
		}
	}

	// base submit function
	let action = "signup";

	function baseSubmit(e: any) {
		if (action === "signup") signup(e);
		else login(e);
	}

	let hasAccount = false;

	onMount(() => {
		if (pb.authStore.model !== null) hasAccount = true;
	});
</script>

<app>
	<Nav />

	<main>
		<section>
			<h1>Account</h1>

			{#if !hasAccount}
				<div class="grid place-center">
					<form
						class="flex mt-12 mb-8"
						style="flex-direction: column; width: var(--u-100);"
						on:submit={(e) => {
							e.preventDefault();
							baseSubmit(e);
						}}
					>
						<label for="username" class="mb-2"><b>Username&ast;</b></label>
						<input type="text" name="username" required placeholder="Username" />

						<label for="password" class="mb-2 mt-4"><b>Password&ast;</b></label>
						<input type="password" name="password" required placeholder="Password" />

						<button class="primary mt-4">Sign Up</button>
						<button
							class="mt-2"
							on:click={() => {
								action = "login";
							}}>Login</button
						>

						<p class="mt-4" style="color: red;">{errorMessage}</p>
					</form>
				</div>
			{:else}
				<button
					on:click={() => {
						// clear auth state and reload
						pb.authStore.clear();
						window.location.reload();
					}}>Sign Out</button
				>
			{/if}
		</section>

		<section class="grid place-center mt-4">
			<span>
				<a href="/{host}/">{host}</a> -
				<a href="https://github.com/oxvs/oivdb" target="_blank" rel="noreferrer"
					><i>Open Image Video Database</i></a
				>
			</span>
		</section>
	</main>
</app>
