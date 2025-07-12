import { objectEntryMap, objectMap, trimPrefix } from "$lib/util";
import { error } from "@sveltejs/kit";

const projects = Object.fromEntries(
  Object.entries(
    import.meta.glob<{
      metadata: {
        title: string;
        description: string;
        techs?: (string | { name: string; url: string })[];
        url?: string | { display: string; href: string };
      };
      default: import("svelte").Component;
    }>("../??-*/content.sveltemd"),
  )
    .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
    .map(([name, load], index) => {
      const [, slug] = /^\.\.\/\d{2}-([^/]+)/.exec(name)!;
      return [
        slug,
        {
          index,
          import: load,
        },
      ];
    }),
);
const thumbnails = objectEntryMap(
  import.meta.glob<string>("../??-*/thumbnail.jpg", {
    eager: true,
    import: "default",
  }),
  (path, name) => {
    const [, slug] = /^\.\.\/\d{2}-([^/]+)/.exec(name)!;
    return [slug, path];
  },
);

export async function load({ params, data: { images } }) {
  const { slug } = params;
  const project = projects[slug];
  if (!project) {
    error(404);
  }

  const { index } = project;
  const { metadata, default: Content } = await project.import();
  const techs =
    metadata.techs?.map((tech) =>
      typeof tech === "string" ? { name: tech, url: "" } : tech,
    ) ?? [];
  const url = !metadata.url
    ? null
    : typeof metadata.url === "string"
      ? {
          display: trimPrefix(metadata.url, "https://"),
          href: metadata.url,
        }
      : metadata.url;

  return {
    Content,
    metadata: {
      ...metadata,
      index,
      techs,
      url,
      slug,
      images,
      thumbnail: thumbnails[slug],
    },
  };
}
