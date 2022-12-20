import PocketBase from "pocketbase";
import type { PageData } from "./$types";

let data: PageData;
// @ts-ignore
const { host } = data;

// create pocketbase client
export const pb = new PocketBase(`http://${host}`)