<script lang="ts">
  import type { AnimationConfig } from "svelte/animate";
  import { raf, resolveCSSValue } from "$lib/util";
  import { spring } from "$lib/easing";
  import HamburgerIcon from "$lib/components/HamburgerIcon.svelte";
  import { onMount } from "svelte";
  import { links, getActiveLinkIndex } from "$lib/model";
  import { beforeNavigate } from "$app/navigation";
  import logo from "$lib/assets/logo.svg";

  const activeLinkIndex = getActiveLinkIndex(links);
  const linkElements: HTMLElement[] = $state([]);
  let underline: {
    left: number;
    width: number;
    opacity: number;
    transition: string;
  } = $state({
    left: 0,
    width: 0,
    opacity: 0,
    transition: "",
  });

  let { children } = $props();
  let menuOpen = $state(false);
  let desktopMQ: MediaQueryList;
  let header: HTMLElement;
  let button: HTMLElement = $state()!;
  let menu: HTMLElement = $state()!;
  onMount(() => {
    desktopMQ = window.matchMedia("(min-width: 680px)");
  });
  let leaving = false;
  beforeNavigate(() => {
    leaving = true;
  });

  async function omouseenterLink(index: number) {
    if (!desktopMQ.matches) {
      return;
    }
    const el = linkElements[index];
    const padding = parseFloat(window.getComputedStyle(el).paddingLeft);
    const parent = el.parentNode as HTMLElement;
    const rect = {
      left: parent.offsetLeft,
      width: el.offsetWidth - padding * 2,
    };
    if (underline.opacity === 0) {
      Object.assign(underline, rect, {
        transition: "none",
      });
      await raf();
      Object.assign(underline, {
        transition: "",
        opacity: 1,
      });
    } else {
      Object.assign(underline, rect);
    }
  }

  function onmouseleaveLinks() {
    if (!desktopMQ.matches) {
      return;
    }
    Object.assign(underline, {
      opacity: 0,
    });
  }

  const [buttonTr, menuTr] = buttonMenuTrs();

  function buttonMenuTrs() {
    function crossfade(node: HTMLElement, otherNode: HTMLElement) {
      const fromRect = node.getBoundingClientRect();
      const toRect = otherNode.getBoundingClientRect();
      const fromStyle = window.getComputedStyle(node);
      const toStyle = window.getComputedStyle(otherNode);
      const fw = fromRect.width;
      const tw = toRect.width;
      const fh = fromRect.height;
      const th = toRect.height;
      const dx = toRect.left - fromRect.left;
      const dy = toRect.top - fromRect.top;
      const fbr = resolveCSSValue(fromStyle.borderTopLeftRadius, fw);
      const tbr = resolveCSSValue(toStyle.borderTopLeftRadius, tw);
      return {
        duration: 400,
        easing: spring,
        css: (t: number, u: number) => {
          return `
            width: ${fw + u * (tw - fw)}px;
            height: ${fh + u * (th - fh)}px;
            transform: translate(${u * dx}px, ${u * dy}px);
            border-radius: ${fbr + u * (tbr - fbr)}px;
            opacity: ${t};
            overflow: hidden;
          `;
        },
      };
    }
    function transition(
      isButton: boolean,
    ): (node: HTMLElement) => AnimationConfig | (() => AnimationConfig) {
      return (node) => {
        if (desktopMQ.matches) {
          return () => crossfade(node, isButton ? menu : button);
        }
        if (isButton) {
          return { duration: 0 };
        }

        const toRect = menu.getBoundingClientRect();
        const th = toRect.height;
        return {
          duration: 800,
          easing: spring,
          css: (t: number, u: number) => {
            return `
              height: ${t * th}px;
              overflow: hidden;
            `;
          },
        };
      };
    }

    return [transition(true), transition(false)];
  }

  function innerTr(node: HTMLElement) {
    if (desktopMQ.matches) {
      return () => {
        const fromRect = button.getBoundingClientRect();
        const toRect = node.getBoundingClientRect();
        const dw = fromRect.width / toRect.width;
        return {
          duration: 400,
          easing: spring,
          css: (t: number, u: number) => {
            return `
            transform-origin: left center;
            transform: scale(${1 - u * (1 - dw)});
          `;
          },
        };
      };
    }
    return { duration: 0 };
  }

  function navLinkTr(
    node: HTMLElement,
    { index }: { index: number },
  ): AnimationConfig {
    if (leaving) {
      return { duration: 0 };
    }
    if (desktopMQ.matches) {
      return {
        delay: index === 0 ? 0 : (index - 1) * 50 + 100,
        duration: 200,
        easing: spring,
        css: (t: number, u: number) => {
          return `
          opacity: ${t};
          transform: translateX(${u * -30}px);
        `;
        },
      };
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

  let startY: number;
  function toggleMenu() {
    menuOpen = !menuOpen;
    document.body.classList.toggle("mobile-locked", menuOpen);
    if (menuOpen) {
      window.addEventListener("click", onclick);
      startY = window.scrollY;
      window.addEventListener("scroll", onscroll);
    }
    function onclick(ev: MouseEvent) {
      const target = ev.target as HTMLElement;
      if (!menuOpen || target.closest("header") === header) {
        return;
      }
      menuOpen = false;
      window.removeEventListener("scroll", onscroll);
      window.removeEventListener("click", onclick);
    }

    function onscroll(ev: Event) {
      if (window.scrollY - startY < 40) return;

      menuOpen = false;
      window.removeEventListener("scroll", onscroll);
      window.removeEventListener("click", onclick);
    }
  }
</script>

<header bind:this={header}>
  <button
    class="menu-toggler mobile"
    class:expanded={menuOpen}
    onclick={toggleMenu}
    ><HamburgerIcon x={menuOpen} /><img
      class="logo"
      src={logo}
      alt="Glen Huang"
    /></button
  >
  {#if !menuOpen}
    <button
      bind:this={button}
      transition:buttonTr
      class="menu-toggler desktop"
      onclick={toggleMenu}><HamburgerIcon /></button
    >
  {/if}
  {#if menuOpen}
    <div bind:this={menu} class="menu" transition:menuTr>
      <div class="inner" transition:innerTr>
        <a data-sveltekit-reload href="/"
          ><img class="logo" src={logo} alt="Glen Huang" /></a
        >
        <nav>
          <div
            class="underline"
            style:left={`${underline.left}px`}
            style:width={`${underline.width}px`}
            style:opacity={underline.opacity}
            style:transition={underline.transition}
          ></div>
          <ul onmouseleave={onmouseleaveLinks}>
            {#each links as link, i}
              <li
                class={{
                  active: i === activeLinkIndex,
                }}
                transition:navLinkTr|global={{ index: i }}
                onmouseenter={() => omouseenterLink(i)}
              >
                <a
                  data-sveltekit-reload
                  href={link.href}
                  bind:this={linkElements[i]}>{link.text}</a
                >
              </li>
            {/each}
          </ul>
        </nav>
      </div>
    </div>
  {/if}
</header>
{@render children()}

<style>
  header {
    margin: 0 -20px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    font-family: var(--sans-serif-fonts);
  }
  .menu-toggler {
    display: flex;
    align-items: center;
    flex: none;
    border: none;
    cursor: pointer;
    background: transparent;
    padding: 10px 20px;
    gap: 10px;
    color: inherit;

    &.mobile {
      margin-left: -20px;
      position: relative;
      z-index: 1;
    }
    &.desktop {
      display: none;
    }
    .logo {
      height: 20px;
      opacity: 0;
      transition: 400ms linear;
    }
    &.expanded .logo {
      opacity: 1;
    }
  }
  .logo {
    aspect-ratio: 494 / 57;
  }
  .menu {
    position: absolute;
    background: #fff;
    left: 0;
    top: 0;
    width: 100vw;
    padding: calc(44px + 10px) 20px 0;
    display: flex;
    height: 100vh;
    overflow: auto;
    .logo {
      display: none;
    }
  }
  .inner {
    flex: 1;
    display: flex;
    justify-content: stretch;
    flex-direction: column;
  }
  nav {
    ul {
      padding: 0;
      margin: 0;
      list-style: none;
    }
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
  @media (min-width: 680px) {
    header {
      padding: 0;
      margin: 0;
    }
    .menu-toggler {
      &.mobile {
        display: none;
      }
      &.desktop {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 30px;
        left: 60px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 1px solid #aaa;
        margin: 0;
        padding: 0;
      }
    }
    .menu {
      position: absolute;
      border: 1px solid #d4d4d4;
      border-radius: 30px;
      display: flex;
      top: 60px;
      width: 400px;
      height: auto;
      left: calc(50vw - 200px);
      padding: 0;
      box-shadow: 0 5px 20px #00000040;
      overflow: visible;

      .logo {
        display: block;
        width: 100%;
        margin-top: 40px;
      }
    }
    .inner {
      padding: 0 40px;
    }
    nav {
      position: relative;
      padding: 0;
      margin-bottom: 20px;
      .underline {
        position: absolute;
        left: 0;
        bottom: 9px;
        width: 0;
        height: 1px;
        background: #000;
        transition: 200ms;
        opacity: 0;
      }
      ul {
        display: flex;
        justify-content: space-between;
        margin: 20px -20px 0;
        position: relative;
      }
      li {
        margin: 0;
        display: flex;
        align-items: center;
        &.active {
          color: #aaa;
        }
        &:first-of-type {
          display: none;
        }
      }
      a {
        display: block;
        font-weight: normal;
        font-size: 20px;
        padding: 20px;
        position: relative;
      }
    }
  }
  @media (min-width: 800px) {
    .menu-toggler.desktop {
      left: calc(50vw - 340px);
    }
  }
  @media (min-width: 900px) {
    .menu-toggler.desktop {
      left: 30px;
    }
  }
  @supports (padding: max(0px)) {
    @media (min-width: 900px) {
      .menu-toggler.desktop {
        left: max(30px, env(safe-area-inset-left));
        top: max(30px, env(safe-area-inset-top));
      }
    }
  }
</style>
