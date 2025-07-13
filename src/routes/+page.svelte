<script lang="ts">
  import { renderClouds } from "$lib/clouds";
  import { onMount } from "svelte";
  import { links } from "$lib/model";
  import logo from "$lib/assets/logo.svg";

  let canvas: HTMLCanvasElement;
  onMount(() => {
    let minWidthMQ = window.matchMedia("(min-width: 680px)");
    return renderClouds({
      canvas,
      desktopMediaQuery: minWidthMQ,
      size() {
        return {
          width: document.documentElement.offsetWidth,
          height: document.documentElement.offsetHeight,
        };
      },
    });
  });
</script>

<svelte:head>
  <title>Glen Huang</title>
</svelte:head>

<canvas bind:this={canvas}></canvas>
<div class="container">
  <div class="intro">
    <div class="content">
      <p>Hello, I'm</p>
      <img class="logo" src={logo} alt="Glen Huang" />
      <p>
        I'm a software engineer focused on web development, DevOps, and building
        tools that boost developer productivity.
      </p>
    </div>
    <nav>
      <ul>
        {#each links.slice(1) as link, i}
          <li><a data-sveltekit-reload href={link.href}>{link.text}</a></li>
        {/each}
      </ul>
    </nav>
  </div>
</div>

<style>
  canvas {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
  }
  .container {
    min-height: 100vh;
    display: flex;
  }
  .intro {
    color: #071c32;
    margin: 0 20px;
    max-width: 572px;
    font: 20px/1.2 var(--sans-serif-fonts);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 300px;
    max-height: 340px;
  }
  .logo {
    display: block;
    width: 100%;
    aspect-ratio: 494 / 57;
    margin: 20px 0 0;
  }
  p {
    margin: 1em 0 0;
  }
  nav {
    ul {
      margin: 0 -20px;
      padding: 0;
      list-style: none;
      display: flex;
      justify-content: space-between;
      max-width: 360px;
      li {
        margin: 0;
        display: flex;
      }
      a {
        text-decoration: none;
        color: inherit;
        padding: 20px;
      }
    }
  }
  @media (min-width: 612px) {
    .intro {
      margin-left: auto;
      margin-right: auto;
    }
  }
  @media (min-width: 715px) {
    .intro {
      margin-left: 10%;
    }
  }
  @media (min-height: 340px) {
    .intro {
      margin-top: calc(50vh - 170px);
    }
  }
  @media (min-height: 567px) {
    .intro {
      margin-top: auto;
      height: 340px;
      margin-bottom: 20vh;
    }
  }
</style>
