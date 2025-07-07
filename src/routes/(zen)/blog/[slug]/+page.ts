import { error } from "@sveltejs/kit";
const articles = import.meta.glob<{
  metadata: {
    title: string;
    layout?: string;
    date?: string;
    readingTime: number;
  };
  default: import("svelte").Component;
}>("../*.md");

export async function load({ params }) {
  const { slug } = params;
  const article = articles[`../${slug}.md`];

  if (!article) {
    error(404, `Article not found: ${slug}`);
  }

  const { metadata, default: Content } = await article();

  return {
    Content,
    metadata,
  };
}
