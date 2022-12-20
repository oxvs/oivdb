import { error } from "@sveltejs/kit";

export const load = async (x: any) => {
	const { params, fetch } = x;

	try {
		// get post before returning
		// NOT POSSIBLE RIGHT NOW
		// const post_f = await fetch(
		// 	`http://${params.host}/api/collections/posts/records/${params.postid}`
		// );

		const post = {
			type: "client-fetch-required",
			// content: await post_f.json()
			content: {} as any
		};

		// return post and params
		return {
			post,
			params
		};
	} catch {
		throw error(400, "Failed to fetch post!");
	}
};
