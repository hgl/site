<script lang="ts">
  import type { AnimationConfig } from "svelte/animate";
  import { resolveCSSValue } from "$lib/util";
  import { spring } from "$lib/easing";
  import HamburgerIcon from "$components/HamburgerIcon.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/state";

  const links = [
    { href: "/", text: "Home" },
    { href: "/blog", text: "Blog" },
    { href: "/projects", text: "Projects" },
    { href: "/about", text: "About" },
  ];
  const activeLinkIndex = links.findIndex(
    (link) =>
      link.href === page.url.pathname ||
      (link.href !== "/" && page.url.pathname.startsWith(link.href + "/")),
  );
  const linkElements: HTMLElement[] = $state([]);
  let underline: HTMLElement = $state()!;

  let { children } = $props();
  let menuOpen = $state(false);
  let desktopMQ: MediaQueryList;
  let header: HTMLElement;
  let button: HTMLElement = $state()!;
  let container: HTMLElement = $state()!;
  onMount(() => {
    desktopMQ = window.matchMedia("(min-width: 680px)");
  });
  $effect(() => {
    if (menuOpen && desktopMQ.matches) {
      moveUnderline(activeLinkIndex);
    }
  });

  function omouseenterLink(index: number) {
    if (!desktopMQ.matches) {
      return;
    }
    moveUnderline(index);
  }

  function onmouseleaveLinks() {
    if (!desktopMQ.matches) {
      return;
    }
    underline.style.opacity = "0";
  }

  function moveUnderline(index: number) {
    const el = linkElements[index];
    const padding = parseFloat(window.getComputedStyle(el).paddingLeft);
    underline.style.opacity = "1";
    underline.style.width = `${el.offsetWidth - padding * 2}px`;
    const parent = el.parentNode as HTMLElement;
    underline.style.transform = `translateX(${parent.offsetLeft + padding}px)`;
  }

  const [buttonTr, containerTr] = buttonContainerTrs();

  function buttonContainerTrs() {
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
          return () => crossfade(node, isButton ? container : button);
        }
        if (isButton) {
          return { duration: 0 };
        }

        const toRect = container.getBoundingClientRect();
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
    if (desktopMQ.matches) {
      return {
        delay: index * 50 + 100,
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
    document.body.classList.toggle("locked", menuOpen);
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
  <button class="hamburger toggable" onclick={toggleMenu}
    ><HamburgerIcon x={menuOpen} /></button
  >
  {#if !menuOpen}
    <button
      bind:this={button}
      transition:buttonTr
      class="hamburger untoggable"
      onclick={toggleMenu}><HamburgerIcon /></button
    >
  {/if}
  {#if menuOpen}
    <div bind:this={container} class="container" transition:containerTr>
      <div class="inner" transition:innerTr>
        <img class="logo" src="/assets/logo.svg" alt="Glen Huang" />
        <nav>
          <ul onmouseleave={onmouseleaveLinks}>
            {#each links as link, i}
              <li
                class={{
                  active: i === activeLinkIndex,
                }}
                transition:navLinkTr|global={{ index: i }}
                onmouseenter={() => omouseenterLink(i)}
              >
                <a href={link.href} bind:this={linkElements[i]}>{link.text}</a>
              </li>
            {/each}
          </ul>
          <div bind:this={underline} class="underline"></div>
        </nav>
        <div class="contact">
          <a class="email" href="mailto:me@glenhuang.com"
            ><img src="/assets/email.svg" alt="Email" /> me@glenhuang.com</a
          >
          <ul class="social">
            <li>
              <a href="https://github.com/hgl"
                ><img src="/assets/github.svg" alt="GitHub" /></a
              >
            </li>
          </ul>
        </div>
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
  button.hamburger {
    display: flex;
    flex: none;
    border: none;
    cursor: pointer;
    background: transparent;
    padding: 10px;

    &.toggable {
      margin-left: -10px;
      position: relative;
      z-index: 1;
    }
    &.untoggable {
      display: none;
    }
  }
  .container {
    position: absolute;
    background: #fff;
    left: 0;
    top: 0;
    width: 100vw;
    padding: calc(44px + 20px) 20px 0;
    display: flex;
    height: 100vh;
  }
  .inner {
    flex: 1;
    display: flex;
    justify-content: stretch;
    flex-direction: column;
  }

  .logo {
    flex: none;
  }
  nav {
    border-bottom: 1px solid #aaa;
    padding: 30px 0 15px;

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
      color: #000;
      padding: 15px 0;
      font-weight: bold;
      font-size: 28px;
      line-height: 1;
    }
  }
  .contact {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 -20px;
  }
  .email {
    display: flex;
    align-items: center;
    font-size: 18px;
    gap: 8px;
    color: #666;
    text-decoration: none;
    padding: 20px;
  }
  .social {
    list-style: none;
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
    li {
      margin: 0;
    }
    li a {
      display: block;
      padding: 20px;
    }
    li a img {
      display: block;
    }
  }
  @media (width >= 680px) {
    header {
      padding: 0;
      margin: 0;
    }
    button.hamburger {
      &.toggable {
        display: none;
      }
      &.untoggable {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 30px;
        left: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 1px solid #aaa;
        margin: 0;
        padding: 0;
      }
    }
    .logo {
      margin-top: 40px;
      width: 420px;
      height: 48.46px;
    }
    nav {
      position: relative;
      padding: 0;
      ul {
        display: flex;
        justify-content: space-between;
        margin: 30px -20px 0;
      }
      li {
        margin: 0;
        display: flex;
        align-items: center;
      }
      a {
        display: block;
        font-weight: normal;
        font-size: 20px;
        padding: 20px;
        position: relative;
      }
      li.active a::before {
        content: "";
        position: absolute;
        left: 20px;
        right: 20px;
        bottom: 0;
        height: 1px;
        background: #000;
      }
      .underline {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 0;
        height: 1px;
        background: #000;
        transition: 200ms;
        opacity: 0;
      }
    }
    .container {
      position: absolute;
      border: 1px solid #d4d4d4;
      border-radius: 30px;
      display: flex;
      top: 60px;
      width: 500px;
      height: auto;
      left: calc(50vw - 250px);
      padding: 0;
      box-shadow: 0 5px 20px #00000040;
    }
    .inner {
      padding: 0 40px;
    }
  }
</style>
