import { fileURLToPath } from "node:url";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

function resolvePath(path: string) {
  return fileURLToPath(new URL(path, import.meta.url));
}

export default defineConfig({
  plugins: [sveltekit()],
});
