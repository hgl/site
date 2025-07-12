const projects = Object.entries(
  import.meta.glob<{
    title: string;
    description: string;
    techs?: (string | { name: string; url: string })[];
    url?: string | { display: string; href: string };
  }>("./??-*/content.sveltemd", { eager: true, import: "metadata" }),
)
  .map(([name, metadata], index) => {
    const [, dir, slug] = /^\.\/(\d{2}-([^/]+))/.exec(name)!;
    return {
      ...metadata,
      index,
      dir,
      slug,
    };
  })
  .sort(({ index: indexA }, { index: indexB }) => indexA - indexB);

export async function load({ params }) {
  return {
    projects: await Promise.all(
      projects.map(async (project) => ({
        ...project,
        thumbnail: (await import(`./${project.dir}/thumbnail.jpg`)).default,
      })),
    ),
  };
}
