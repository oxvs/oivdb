<script lang="ts">
	import Nav from "$lib/nav.svelte";

	import PocketBase, { Record } from "pocketbase";
	import { onMount } from "svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
	// @ts-ignore because they ruined sveltekit
	export let { params, post } = data;

	const pb = new PocketBase(`http://${params.host}`);
	let isVideo = false;

	let creator: { [key: string]: any } = {};

	onMount(async () => {
		if (post.type === "client-fetch-required")
			post = {
				type: "post-fetch",
				content: await pb.collection("posts").getOne(params.postid)
			};

		// get creator
		creator = await pb.collection("users").getOne(post.content.creator);

		// check if video
		const mediaUrl = post.content.media;
		isVideo = mediaUrl.endsWith(".webm") || mediaUrl.endsWith(".mp4");
	});

	async function deletePost() {
		try {
			await pb.collection("posts").delete(params.postid);
			window.location.href = `/${params.host}/`;
		} catch {
			alert("Failed to delete.");
		}
	}
</script>

<svelte:head>
	<title>{post.content.id} - OIVDB &lpar;{params.host}&rpar;</title>
</svelte:head>

<app>
	<Nav />

	<main>
		<section>
			<h1>{post.content.id || ""}</h1>

			<div class="grid place-center">
				{#if isVideo}
					<video
						src="http://{params.host}/api/files/posts/{params.postid}/{post.content.media}"
						controls
					>
						<track kind="captions" />
					</video>
				{:else}
					<img
						src="http://{params.host}/api/files/posts/{params.postid}/{post.content.media}"
						alt="Unknown"
					/>
				{/if}
			</div>

			<p class="mt-4">{post.content.description || ""}</p>
		</section>

		<section class="mt-2">
			<p>
				Uploaded by: <a
					class="chip"
					href="/"
					title="Created: {new Date(creator.created).toLocaleString()}">{creator.username}</a
				>
			</p>

			<p>Uploaded: {new Date(post.content.created).toLocaleString()}</p>
			<p>Last updated: {new Date(post.content.updated).toLocaleString()}</p>
		</section>

		<!-- controls -->
		<section class="mt-2">
			{#if post.content.creator === (pb.authStore.model || { id: "" }).id}
				<button
					class="primary"
					on:click={() => {
						deletePost();
					}}>Delete</button
				>
			{/if}
		</section>

		<!-- footer -->
		<section class="grid place-center mt-8">
			<span>
				<a href="/{params.host}/">{params.host}</a>/{params.postid} -
				<a href="https://github.com/oxvs/oivdb" target="_blank" rel="noreferrer"
					><i>Open Image Video Database</i></a
				>
			</span>
		</section>
	</main>
</app>

<style>
	img,
	video {
		max-width: 100%;
	}

	video {
		filter: invert(1) hue-rotate(180deg); /* undo filter */
	}

	button {
		width: max-content;
	}
</style>
