<script lang="ts">
  import PageLayout from "$lib/components/layouts/PageLayout.svelte";
  import * as blog from "$lib/util/blog.js";
  import { pageTitle } from "$lib/util/index.js";
  let { data } = $props();
  let { articles } = data;
</script>

<svelte:head>
  <title>{pageTitle("Blog")}</title>
</svelte:head>

<PageLayout title="Blog">
  {#each articles as article}
    <h2>
      <a data-sveltekit-reload href={`/blog/${article.slug}`}>{article.title}</a
      >
    </h2>
    <div class="meta">
      <time datetime={blog.toISODateString(article.date)}
        >{blog.toDateString(article.date)}</time
      >
      <span class="reading-time"
        >{blog.toReadingTimeString(article.readingTime)}</span
      >
    </div>
  {/each}
</PageLayout>

<style>
  h2 {
    font-weight: normal;
    font-size: 24px;
    a {
      text-decoration: none;
      color: inherit;
    }
  }
  .meta {
    font: 18px/1 var(--sans-serif-fonts);
    display: flex;
    color: #aaa;
    gap: 1.5em;
    margin-top: 0.5em;
  }
</style>
