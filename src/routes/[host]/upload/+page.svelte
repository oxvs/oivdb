<script lang="ts">
	import PocketBase from "pocketbase";

	import Nav from "$lib/nav.svelte";
	import type { PageData } from "./$types";
	import { onMount } from "svelte";
	import { error } from "@sveltejs/kit";

	export let data: PageData;
	// @ts-ignore because they ruined sveltekit
	export const { host } = data;

	// create pb client
	const pb = new PocketBase(`http://${host}`);

	// handle form submit
	let errorMessage = "";

	async function upload(e: any) {
		if (!pb.authStore.model) return;

		// create formdata for files
		const fd = new FormData();

		// load files
		for (let file of e.target.file.files) fd.append("media", file);

		// add description
		fd.set("description", e.target.description.value);

		// add creator
		fd.set("creator", pb.authStore.model.id);

		// create record
		try {
			const record = await pb.collection("posts").create(fd);

			// navigate to post
			window.location.href = `/${host}/post/${record.id}`;
		} catch (err: any) {
			errorMessage = err;
		}
	}

	onMount(() => {
		if (pb.authStore.model === null) window.location.href = `/${host}/auth`;
	});
</script>

<app>
	<Nav />

	<main>
		<section>
			<h1>Upload</h1>

			<p>
				Upload content to this server. We're not sure what the file size limit is, but the default
				limit is 100MB. Accepted file types are:
			</p>

			<br />
			<pre><code
					>image/jpg, image/jpeg, image/png, image/svg+xml, image/gif, video/mp4, video/x-ms-wmv, video/quicktime, video/3gpp, video/webm</code
				></pre>

			<div class="grid place-center">
				<form
					class="flex mt-12 mb-8"
					style="flex-direction: column; width: var(--u-100);"
					on:submit={(e) => {
						e.preventDefault();
						upload(e);
					}}
				>
					<label for="file" class="mb-2"><b>File&ast;</b></label>
					<input
						type="file"
						name="file"
						required
						accept="image/jpg, image/jpeg, image/png, image/svg+xml, image/gif, video/mp4, video/x-ms-wmv, video/quicktime, video/3gpp, video/webm"
					/>

					<label for="description" class="mb-2 mt-4"><b>Description</b></label>
					<textarea name="description" />

					<button class="primary mt-4">Upload</button>
					<p class="mt-4" style="color: red;">{errorMessage}</p>
				</form>
			</div>
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
