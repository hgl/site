import { toDate, toDuration } from "$lib/util";
import { error } from "@sveltejs/kit";
const articles = import.meta.glob<{
  metadata: {
    title: string;
    slug: string;
    layout?: string;
    date: string;
    readingTime: number;
  };
  default: import("svelte").Component;
}>("../*.sveltemd");

export async function load({ params }) {
  const { slug } = params;
  const article = articles[`../${slug}.sveltemd`];

  if (!article) {
    error(404, "");
  }

  const { metadata, default: Content } = await article();

  return {
    Content,
    metadata: {
      ...metadata,
      date: toDate(metadata.date),
      readingTime: toDuration(metadata.readingTime),
      slug,
    },
  };
}
