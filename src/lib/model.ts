import { page } from "$app/state";

export const links = [
  { href: "/", text: "Home" },
  { href: "/blog", text: "Blog" },
  { href: "/projects", text: "Projects" },
  { href: "/about", text: "About" },
];

export function getActiveLinkIndex(lns: typeof links): number {
  return Array.from(lns).findIndex(
    (link) =>
      link.href === page.url.pathname ||
      (link.href !== "/" && page.url.pathname.startsWith(link.href + "/")),
  );
}
