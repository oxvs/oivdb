<script>
	// @ts-nocheck
	import { page } from "$app/stores";
</script>

<svelte:head>
	<title>? - OIVDB</title>
</svelte:head>

<main>
	<section>
		<h2>That's no good!</h2>

		<button
			on:click={() => {
				window.location.href = "/";
			}}>Return Home</button
		>

		<section class="mt-4">
			<pre>
                <code><b><i>{$page.status}</i></b>: {$page.error.message}</code>
            </pre>
		</section>
	</section>
</main>
