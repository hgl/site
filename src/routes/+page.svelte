<script lang="ts">
  import { renderClouds } from "$lib/clouds";
  import { onMount } from "svelte";
  import { links } from "$lib/model";
  import logo from "$lib/assets/logo.svg";

  let canvas: HTMLCanvasElement;
  onMount(() => {
    return renderClouds({
      canvas,
      desktopMediaQuery: window.matchMedia("(min-width: 680px)"),
      size() {
        return {
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });
  });
</script>

<svelte:head>
  <title>Glen Huang</title>
</svelte:head>

<canvas bind:this={canvas}></canvas>
<div class="intro">
  <p>Hello, I'm</p>
  <img class="logo" src={logo} alt="Glen Huang" />
  <p>
    I'm a software engineer focused on web development, DevOps, and building
    tools that boost developer productivity.
  </p>

  <nav>
    <ul>
      {#each links.slice(1) as link, i}
        <li><a data-sveltekit-reload href={link.href}>{link.text}</a></li>
      {/each}
    </ul>
  </nav>
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
  .intro {
    color: #071c32;
    position: absolute;
    bottom: 20%;
    left: 0;
    right: 0;
    margin: 0 20px;
    max-width: 572px;
    font: 20px/1.2 var(--sans-serif-fonts);
  }
  .logo {
    display: block;
    width: 100%;
    aspect-ratio: 494 / 57;
  }
  p {
    margin: 1em 0;
  }
  nav {
    margin-top: 80px;
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
      left: 10%;
      right: auto;
    }
  }
</style>
