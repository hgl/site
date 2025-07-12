<script lang="ts">
  import PageLayout from "$lib/components/layouts/PageLayout.svelte";
  import { pageTitle } from "$lib/util/index.js";
  let { data } = $props();
  let { projects } = data;
</script>

<svelte:head>
  <title>{pageTitle("Projects")}</title>
</svelte:head>

<PageLayout type="showcase" title="Projects">
  {#snippet intro()}
    A selection of things I’ve built with care, in the hope they might be useful
    to others too.
  {/snippet}
  <div class="container">
    {#each projects as project}
      <a
        data-sveltekit-reload
        class="project"
        href={`/projects/${project.slug}`}
      >
        <article>
          <h1>{project.title}</h1>
          <img src={project.thumbnail} alt="Logo" />
          <p>{project.description}</p>
        </article>
      </a>
    {/each}
    {#each Array(projects.length % 3 === 0 ? 0 : 3 - (projects.length % 3))}
      <div class="project"></div>
    {/each}
  </div>
</PageLayout>

<style>
  .container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  .project {
    flex: 1 1 100%;
    min-width: 0;
    display: flex;
    text-decoration: none;
    color: inherit;
  }
  article {
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 0;
    flex-direction: column;
    font: 16px/1 var(--sans-serif-fonts);
    img {
      flex: none;
      order: -1;
      border-radius: 10%;
      aspect-ratio: 1;
    }
    h1 {
      font-size: 22px;
      font-weight: normal;
      margin: 0.8em 0.5em 0;
    }
    p {
      margin: 0.5em 0.5em 2em;
      color: #aaa;
    }
  }

  @media (min-width: 600px) {
    .project {
      flex: 1 1 200px;
      img {
        transition: 400ms;
      }
    }
  }
  @media (min-width: 680px) {
    .container {
      gap: 30px;
    }
    .project {
      &:hover img {
        transform: scale(1.1);
        border: 0;
        box-shadow: 0 6px 32px #00000090;
      }
    }
  }

  @media (min-width: 900px) {
    .container {
      gap: 60px;
    }
    .project {
      flex: 1 1 300px;
    }
  }
</style>
