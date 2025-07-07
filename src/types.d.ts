// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

declare module "*.md" {
  import type { Component } from "svelte";

  export { Component as default };

  export const metadata: Record<string, unknown>;
}

export {};
