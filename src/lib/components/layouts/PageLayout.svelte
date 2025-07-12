<script lang="ts">
  import { beforeNavigate } from "$app/navigation";
  import HamburgerIcon from "$lib/components/HamburgerIcon.svelte";
  import { links, getActiveLinkIndex } from "$lib/model";
  import { spring } from "$lib/easing";
  import type { Snippet } from "svelte";
  import { toSlug } from "$lib/util";
  import logo from "$lib/assets/logo.svg";
  import logoSmall from "$lib/assets/logo-small.svg";

  let {
    title,
    intro,
    type = "reading",
    children,
  }: {
    title: string | string[];
    intro?: Snippet;
    type?: "reading" | "showcase";
    children: Snippet;
  } = $props();
  const activeLinkIndex = getActiveLinkIndex(links);
  let menuOpen = $state(false);

  let leaving = false;
  beforeNavigate(() => {
    leaving = true;
  });

  function toggleMenu() {
    menuOpen = !menuOpen;
    document.body.classList.toggle("mobile-locked", menuOpen);
  }

  function menuTr(node: HTMLElement) {
    const toRect = node.getBoundingClientRect();
    const th = toRect.height;
    return {
      duration: 400,
      easing: spring,
      css: (t: number, u: number) => {
        return `
          height: ${t * th}px;
          overflow: hidden;
        `;
      },
    };
  }

  function navLinkTr(node: HTMLElement, { index }: { index: number }) {
    if (leaving) {
      return { duration: 0 };
    }

    return {
      delay: index * 50 + 150,
      duration: 400,
      easing: spring,
      css: (t: number, u: number) => {
        return `
          opacity: ${t};
          transform: translateY(${u * -15}px);
        `;
      },
    };
  }
</script>

<div class={{ container: true, [type]: true }}>
  <header>
    <button class="menu-toggler" onclick={toggleMenu}
      ><HamburgerIcon x={menuOpen} /><img
        class="logo hamburger"
        src={logo}
        alt="Glen Huang"
      /></button
    >
    <a data-sveltekit-reload class="logo small" href="/"
      ><img src={logoSmall} alt="Glen Huang" /></a
    >
    <a data-sveltekit-reload class="logo full" href="/"
      ><img src={logo} alt="Glen Huang" /></a
    >
    {#if menuOpen}
      <nav class="mobile" transition:menuTr>
        <ul>
          {#each links as link, i}
            <li
              class={{
                active: i === activeLinkIndex,
              }}
              transition:navLinkTr|global={{ index: i }}
            >
              <a data-sveltekit-reload href={link.href}>{link.text}</a>
            </li>
          {/each}
        </ul>
      </nav>
    {/if}
    <nav class="desktop">
      <ul>
        {#each links as link, i}
          <li
            class={{
              active: i === activeLinkIndex,
            }}
          >
            <a data-sveltekit-reload href={link.href}>{link.text}</a>
          </li>
        {/each}
      </ul>
    </nav>
  </header>
  <article>
    {#if Array.isArray(title)}
      <ol class="categories">
        {#each title.slice(0, -1) as category, i}
          <li>
            <a
              data-sveltekit-reload
              href={`/${toSlug(title.slice(i, -1).join("/"))}`}>{category}</a
            >
          </li>
        {/each}
      </ol>
      <h1 class="has-categories" class:has-intro={intro}>
        {title[title.length - 1]}
      </h1>
    {:else}
      <h1 class:has-intro={intro}>{title}</h1>
    {/if}
    {#if intro}
      <div class="intro">
        {@render intro()}
      </div>
    {/if}
    {@render children()}
  </article>
  <footer>
    <p>&copy; {new Date().getFullYear()} Glen Huang. All Rights Reserved.</p>
  </footer>
</div>

<style>
  header {
    display: flex;
    margin: 0 -20px;
    font-family: var(--sans-serif-fonts);
  }
  .menu-toggler {
    margin: 0;
    padding: 15px 20px;
    border: 0;
    background: transparent;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    position: relative;
    z-index: 1;
    color: inherit;
  }
  .logo {
    box-sizing: content-box;
    &.hamburger {
      height: 20px;
    }
    &.small {
      aspect-ratio: 112 / 54;
      display: none;
    }
    &.full {
      aspect-ratio: 494 / 57;
      display: none;
    }
  }
  nav {
    position: absolute;
    &.mobile {
      position: absolute;
      left: 0;
      top: 0;
      padding: calc(54px) 20px 0;
      width: 100vw;
      height: 100vh;
      background: #fff;
      overflow: auto;

      ul {
        margin: 0;
        padding: 0;
        list-style: none;

        li {
          margin: 0;
        }

        a {
          display: block;
          text-decoration: none;
          color: inherit;
          padding: 15px 0;
          font-weight: bold;
          font-size: 32px;
          line-height: 1;
        }
      }
    }
    &.desktop {
      display: none;
    }
  }
  article {
    margin: 40px auto 40px;
    .reading & {
      max-width: 680px;
    }
    .showcase & {
      max-width: 1200px;
    }
    .categories {
      padding: 0;
      margin: 40px 0 0;
      list-style: none;
      color: #666;
      font-family: var(--sans-serif-fonts);

      a {
        text-decoration: none;
        color: inherit;
      }
    }
    h1 {
      margin: 1em 0 0.8em;
      font-size: 40px;
      &.has-categories {
        margin-top: 0;
      }
      &.has-intro {
        margin-bottom: 0;
      }
    }
  }
  footer {
    font: 14px/1 var(--sans-serif-fonts);
    text-align: center;
    margin: 20px auto;
    color: #999;
    .reading & {
      max-width: 680px;
    }
    .showcase & {
      max-width: 1200px;
    }
  }
  .intro {
    margin: 0.5em 0 32px;
  }
  @media (min-width: 680px) {
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      margin-bottom: 10px;
      max-width: 1200px;
      font-size: 18px;
      line-height: 1;
    }
    article {
      margin-top: 80px;
      margin-bottom: 120px;
    }
    .menu-toggler {
      display: none;
    }
    .logo.full {
      display: block;
      padding: 20px;
      img {
        height: 20px;
      }
    }
    nav {
      position: static;
      &.mobile {
        display: none;
      }
      &.desktop {
        display: block;
      }
      ul {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        gap: 1em;

        li {
          margin: 0;
          display: flex;
          &:first-of-type {
            display: none;
          }
          &.active {
            color: #aaa;
          }
        }
        a {
          padding: 20px;
          text-decoration: none;
          color: inherit;
        }
      }
    }
    h1 {
      font-size: 50px;
    }
    .intro {
      margin-bottom: 40px;
    }
    footer {
      font-size: 16px;
      margin-top: 40px;
      margin-bottom: 40px;
    }
  }

  @media (min-width: 1200px) {
    header {
      margin-left: auto;
      margin-right: auto;
    }
    .logo {
      &.small {
        display: none;
      }
      &.full {
        display: block;
        margin-left: -20px;
        img {
          height: 20px;
        }
      }
    }
    nav {
      margin-right: -20px;
    }
  }
</style>
