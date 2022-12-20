<script lang="ts">
	import Nav from "$lib/nav.svelte";

	import { connectedServer } from "./connection";

	let errorMessage = "";
	async function changeServer(e: SubmitEvent) {
		const server = new URL((e as any).target.serverurl.value);
		connectedServer.set(server.href);

		// check if server is valid
		try {
			const res = await (await fetch(server.href)).json();

			// load server page
			if (res.code === 404)
				window.location.href = `/${server.hostname}${
					server.port !== undefined ? `:${server.port}` : ""
				}/`;
			else errorMessage = "Server is invalid.";
		} catch {
			errorMessage = "Server is invalid.";
		}
	}
</script>

<svelte:head>
	<title>Manage Connection - OIVDB</title>
</svelte:head>

<body>
	<Nav />

	<main>
		<section>
			<h1>Manage Connection</h1>

			<p>
				Manage your server connection. This determines where we load images and your account from.
				Make sure the provider is an entity you trust!
			</p>

			<!-- Connection Form -->
			<div class="grid place-center">
				<form
					class="flex mt-8 mb-8"
					on:submit={(e) => {
						e.preventDefault();
						changeServer(e);
					}}
				>
					<label for="serverurl" class="mb-2"><b>Server URL&ast;</b></label>
					<input type="url" placeholder="Server URL" name="serverurl" required />

					<button class="primary mt-4">Change Server</button>
					<p class="mt-4" style="color: red;">{errorMessage}</p>
				</form>
			</div>
		</section>

		<section class="grid place-center mt-4">
			<a href="https://github.com/oxvs/oivdb" target="_blank" rel="noreferrer"
				><i>Open Image Video Database</i></a
			>
		</section>
	</main>
</body>

<style>
	.flex {
		flex-direction: column;
	}

	form {
		width: var(--u-100);
	}
</style>
