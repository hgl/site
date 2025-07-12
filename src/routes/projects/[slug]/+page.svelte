<script lang="ts">
  import Icon from "$lib/components/Icon.svelte";
  import PageLayout from "$lib/components/layouts/PageLayout.svelte";
  import { pageTitle } from "$lib/util/index.js";

  let { data } = $props();
  let { Content, metadata } = data;

  let { title, techs, url, images, thumbnail } = metadata!;
  let activeImageIndex = $state(0);
  function showImage(index: number) {
    activeImageIndex = index;
  }
</script>

<svelte:head>
  <title>{pageTitle(title)}</title>
</svelte:head>

<PageLayout {title}>
  {#if images.mobile.length !== 0 || images.desktop.length !== 0}
    {@const mobileImages =
      images.mobile.length !== 0 ? images.mobile : images.desktop}
    {@const desktopImages =
      images.desktop.length !== 0 ? images.desktop : images.mobile}
    <div class="images mobile">
      {#each mobileImages as { width, height, path }, i}
        <a data-sveltekit-reload href={path}>
          <img
            src={path}
            style:aspect-ratio={width / height}
            alt={`Screenshot ${i + 1}`}
          />
        </a>
      {/each}
    </div>
    <div class="images desktop">
      <div
        class="inner"
        style:transform={`translateX(${activeImageIndex * -100}%) translateX(${activeImageIndex * -40}px)`}
      >
        {#each desktopImages as { width, height, path }, i}
          <a data-sveltekit-reload href={path}>
            <img
              src={path}
              style:aspect-ratio={width / height}
              alt={`Screenshot ${i + 1}`}
            />
          </a>
        {/each}
      </div>
    </div>
    <div class="controller">
      <button
        class="prev"
        disabled={activeImageIndex === 0}
        onclick={() => showImage(activeImageIndex - 1)}
      >
        <Icon name="chevron-left" width={18} height={18} />
      </button>
      <button
        class="next"
        disabled={activeImageIndex === desktopImages.length - 1}
        onclick={() => showImage(activeImageIndex + 1)}
      >
        <Icon name="chevron-right" width={18} height={18} />
      </button>
      <div class="dots">
        {#each desktopImages as _, i}
          <button
            class:active={activeImageIndex === i}
            onclick={() => showImage(i)}><span>{i + 1}</span></button
          >
        {/each}
      </div>
    </div>
  {:else}
    <div class="thumbnail"><img src={thumbnail} alt="Thumbnail" /></div>
  {/if}
  <ul class="meta">
    {#if techs.length !== 0}
      <li>
        <span class="title">Techs</span>
        <ul class="techs">
          {#each techs as tech}
            <li>
              {#if tech.url}
                <a data-sveltekit-reload href={tech.url}>{tech.name}</a>
              {:else}
                {tech.name}
              {/if}
            </li>
          {/each}
        </ul>
      </li>
    {/if}
    {#if url}
      <li>
        <span class="title">URL</span>
        <a data-sveltekit-reload class="url" href={url.href}>{url.display}</a>
      </li>
    {/if}
  </ul>
  <Content />
</PageLayout>

<style>
  .meta {
    font: 16px/1 var(--sans-serif-fonts);
    list-style: none;
    display: flex;
    flex-direction: column;
    margin: 1.2em 0;
    padding: 0;
    gap: 1.2em;

    > li {
      display: flex;
      align-items: baseline;
      margin: 0;
    }
    a {
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .images {
    &.mobile {
      margin: 0 -20px;
      display: flex;
      align-items: center;
      overflow: auto;
      gap: 20px;
      padding: 0 20px 0 0;
      a {
        flex: none;
        width: calc(100% - 60px);
      }
      img {
        display: block;
        width: 100%;
        border-radius: 16px;
      }
    }

    &.desktop {
      display: none;
    }
  }
  .thumbnail {
    width: 280px;
    img {
      display: block;
      width: 100%;
      aspect-ratio: 1;
      border-radius: 16px;
    }
  }
  .controller {
    display: none;
  }
  .title {
    width: 4em;
    font-weight: bold;
  }
  .techs {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    gap: 0.5em;
    li {
      margin: 0;
      color: #000;
      background: #eee;
      padding: 0.1em 0.6em;
      border-radius: 4px;
      font-size: 14px;
    }
  }
  .url {
    padding: 0.1em 0;
  }
  @media (min-width: 680px) {
    .images {
      &.mobile {
        display: none;
      }
      &.desktop {
        display: block;
        width: 100vw;
        margin-left: -60px;
        overflow: hidden;
        .inner {
          display: flex;
          gap: 40px;
          transform: translateX(-100%) translateX(-40px);
          transition: 500ms;
        }
        a {
          flex: none;
          width: 100%;
        }
        img {
          display: block;
          width: 100%;
        }
      }
    }
    .controller {
      display: flex;
      margin: 25px 0;
      gap: 12px;

      > button {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: 0;
        background: #d9d9d9;
        color: #444;
        cursor: pointer;
        &:active {
          background: #ccc;
        }
        &[disabled] {
          color: #d6d6d6;
          background: #eee;
        }
      }
      .dots {
        display: flex;
        height: 48px;
        align-items: center;
        background: #d9d9d9;
        border-radius: 999em;
        padding: 0 16px;
        > button {
          padding: 8px;
          border: 0;
          background: transparent;
          cursor: pointer;
          > span {
            display: block;
            text-indent: -999em;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #aaa;
          }
          &.active {
            > span {
              background: #444;
            }
          }
        }
      }
    }
  }
  @media (min-width: 800px) {
    .images {
      &.desktop {
        margin-left: calc(-1 * (50vw - 680px / 2));
        a {
          display: block;
          width: 100%;
          height: 100%;
        }
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  @media (min-width: 1200px) {
    .images {
      &.desktop {
        margin-left: calc(-1 * ((1200px - 680px) / 2));
        width: 1200px;
        border-radius: 40px;
      }
    }
  }
</style>
