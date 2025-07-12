import { mdsvex, escapeSvelte } from "mdsvex";
import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { createHighlighter } from "shiki";
import { visit } from "unist-util-visit";
import getReadingTime from "reading-time";

const highlighterTheme = "catppuccin-latte";
const highlighter = await createHighlighter({
  themes: [highlighterTheme],
  langs: ["javascript", "typescript", "diff", "nix"],
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  extensions: [".svelte", ".sveltemd"],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: [".sveltemd"],
      remarkPlugins: [mdStats],
      highlight: {
        highlighter: async (code, lang = "text") => {
          const html = escapeSvelte(
            highlighter.codeToHtml(code, { lang, theme: highlighterTheme }),
          );
          return `{@html \`${html}\` }`;
        },
      },
    }),
  ],
  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter(),
    files: {
      appTemplate: "src/site.html",
    },
  },
};

export default config;

function mdStats() {
  return (tree, vFile) => {
    let text = "";
    visit(tree, ["text", "code"], (node) => {
      text += node.value;
    });
    const { fm } = vFile.data;
    if (!fm) {
      return;
    }

    const { time: readingTime, words: wordCount } = getReadingTime(text);
    Object.assign(fm, { readingTime, wordCount });
  };
}
