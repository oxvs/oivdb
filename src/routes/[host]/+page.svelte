<script lang="ts">
	import PocketBase, { Record } from "pocketbase";

	import Nav from "$lib/nav.svelte";
	import type { PageData } from "./$types";
	import { onMount } from "svelte";

	export let data: PageData;
	// @ts-ignore
	export const { host } = data;

	// create pocketbase client
	const pb = new PocketBase(`http://${host}`);

	let postList: Array<Record> = [];
	onMount(async () => {
		// fetch posts
		// maximum of 50, page 1, sort by -created
		const posts = await pb.collection("posts").getList(1, 50, {
			sort: "-created"
		});

		postList = posts.items;
	});
</script>

<app>
	<Nav />

	<main>
		<section class="mb-4 flex justify-center" style="gap: var(--u-2);">
			<a href="/{host}/auth" class="chip">Account</a>
			<a href="/{host}/upload" class="chip">Upload</a>
		</section>

		<section class="flex justify-center" style="gap: var(--u-2); flex-wrap: wrap;">
			{#each postList as post}
				<a class="chip" href="/{host}/post/{post.id}">{post.id}</a>
			{:else}
				<p>👻 No posts found...</p>
			{/each}
		</section>

		<section class="grid place-center mt-4">
			<span>
				{host} -
				<a href="https://github.com/oxvs/oivdb" target="_blank" rel="noreferrer"
					><i>Open Image Video Database</i></a
				>
			</span>
		</section>
	</main>
</app>
