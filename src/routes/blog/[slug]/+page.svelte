<script lang="ts">
  import ZenLayout from "$lib/components/layouts/ZenLayout.svelte";
  import * as blog from "$lib/util/blog.js";
  import { pageTitle } from "$lib/util/index.js";
  let { data } = $props();
  let { Content, metadata } = data;
  let { title, date, readingTime, layout } = metadata;
</script>

<svelte:head>
  <title>{pageTitle(title)}</title>
</svelte:head>

<ZenLayout>
  {#if !layout || layout === "article"}
    <article>
      <header>
        <h1>{title}</h1>
        <ul>
          {#if date}
            <li>
              <time datetime={blog.toISODateString(date)}
                >{blog.toDateString(date)}</time
              >
            </li>
          {/if}
          <li>
            {blog.toReadingTimeString(readingTime)}
          </li>
        </ul>
      </header>
      <Content />
    </article>
  {/if}
</ZenLayout>

<style>
  article {
    margin: 40px 0 80px;
  }
  ul {
    font-family: "Inter", sans-serif;
    font-size: 16px;
    font-optical-sizing: auto;
    color: #999;
    list-style: none;
    margin: 1em 0;
    padding: 0;
    display: flex;
    > li {
      margin-left: 2em;
      &:first-child {
        margin-left: 0;
      }
    }
  }

  @media (min-width: 680px) {
    article {
      margin: 120px auto;
      max-width: 680px;
    }
    ul {
      width: 680px;
    }
  }
</style>
