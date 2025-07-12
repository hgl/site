import { toDate, toDuration } from "$lib/util";

const articles = Object.entries(
  import.meta.glob<{
    title: string;
    slug: string;
    layout?: string;
    date: string;
    readingTime: number;
  }>("./*.sveltemd", {
    eager: true,
    import: "metadata",
  }),
)
  .map(([slug, metadata]) => ({
    ...metadata,
    date: toDate(metadata.date),
    readingTime: toDuration(metadata.readingTime),
    slug: slug.slice(0, -9),
  }))
  .sort((a, b) => b.date.getTime() - a.date.getTime());

export async function load({ params }) {
  return {
    articles,
  };
}
