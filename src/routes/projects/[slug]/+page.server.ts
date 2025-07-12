import { read } from "$app/server";
import { asyncMap, objectAsyncMap, objectMap } from "$lib/util";
import sharp from "sharp";

const imagePaths = objectMap(
  Object.entries(
    import.meta.glob<string>("../??-*/images/*.jpg", {
      eager: true,
      import: "default",
    }),
  ).reduce(
    (acc, [glob, path]) => {
      const [, slug, name, isDesktop] =
        /^\.\.\/\d{2}-([^/]+)\/images\/(.+?)(@desktop)?\.[^.]+$/.exec(glob)!;
      let images = acc[slug];
      if (!images) {
        images = acc[slug] = {
          mobile: {},
          desktop: {},
        };
      }
      if (isDesktop) {
        images.desktop[name] = path;
      } else {
        images.mobile[name] = path;
      }
      return acc;
    },
    {} as Record<
      string,
      {
        mobile: Record<string, string>;
        desktop: Record<string, string>;
      }
    >,
  ),
  (images) => ({
    mobile: Object.entries(images.mobile)
      .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
      .map(([, path]) => path),
    desktop: Object.entries(images.desktop)
      .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
      .map(([, path]) => path),
  }),
);

export async function load({ params }) {
  const { slug } = params;

  return {
    images:
      slug in imagePaths
        ? await objectAsyncMap(
            imagePaths[slug],
            async (paths) =>
              await asyncMap(paths, async (path) => {
                const buf = await read(path).bytes();
                const { width, height } = await sharp(buf).metadata();
                return { path, width, height } as const;
              }),
          )
        : {
            mobile: [],
            desktop: [],
          },
  };
}
