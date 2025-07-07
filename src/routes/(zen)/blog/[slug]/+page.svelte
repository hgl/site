<script lang="ts">
  import * as blog from "$lib/blog";
  let { data } = $props();
  let { Content, metadata } = data;
  let { title, date, readingTime, layout } = metadata!;
</script>

<svelte:head>
  <title>{title} | Glen Huang</title>
</svelte:head>

{#if !layout || layout === "article"}
  <article>
    <header>
      <h1>{title}</h1>
      <ul>
        {#if date}
          <li>
            <time datetime={blog.toISODate(date)}>{blog.toDate(date)}</time>
          </li>
        {/if}
        <li>
          {blog.toReadingTime(readingTime)} read
        </li>
      </ul>
    </header>
    <Content />
  </article>
{/if}

<style>
  :global(pre) {
    margin-left: -26px;
    margin-right: -26px;
  }
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
  }
  ul > li {
    margin-left: 2em;
  }
  ul > li:first-child {
    margin-left: 0;
  }

  @media (min-width: 680px) {
    :global(pre) {
      margin-left: 0;
      margin-right: 0;
    }
    article {
      margin: 120px auto;
      max-width: 680px;
    }
    ul {
      width: 680px;
    }
  }
</style>
