<script lang="ts">
  let { x = false } = $props();
  let topBarToX: SVGAnimateElement;
  let topBarToHamburger: SVGAnimateElement;
  let middleBarToX: SVGAnimateElement;
  let middleBarToHamburger: SVGAnimateElement;
  let bottomBarToX: SVGAnimateElement;
  let bottomBarToHamburger: SVGAnimateElement;

  let isMounted = false;
  $effect(() => {
    x;
    if (!isMounted) {
      isMounted = true;
      return;
    }
    if (x) {
      topBarToX.beginElement();
      middleBarToX.beginElement();
      bottomBarToX.beginElement();
    } else {
      topBarToHamburger.beginElement();
      middleBarToHamburger.beginElement();
      bottomBarToHamburger.beginElement();
    }
  });
</script>

<svg width="24" height="24" viewBox="0 0 24 24">
  <!-- Top bar: horizontal <-> diagonal (\) -->
  <path
    d="M3 6 L21 6"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
  >
    <animate
      attributeName="d"
      from="M3 6 L21 6"
      to="M6 6 L18 18"
      dur="0.4s"
      fill="freeze"
      begin="indefinite"
      bind:this={topBarToX}
    />
    <animate
      attributeName="d"
      from="M6 6 L18 18"
      to="M3 6 L21 6"
      dur="0.4s"
      fill="freeze"
      begin="indefinite"
      bind:this={topBarToHamburger}
    />
  </path>
  <!-- Middle bar: fade out/in -->
  <path
    d="M3 12 L21 12"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
  >
    <animate
      attributeName="opacity"
      from="1"
      to="0"
      dur="0.3s"
      fill="freeze"
      begin="indefinite"
      bind:this={middleBarToX}
    />
    <animate
      attributeName="opacity"
      from="0"
      to="1"
      dur="0.3s"
      fill="freeze"
      begin="indefinite"
      bind:this={middleBarToHamburger}
    />
  </path>
  <!-- Bottom bar: horizontal <-> diagonal (/) -->
  <path
    d="M3 18 L21 18"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
  >
    <animate
      attributeName="d"
      from="M3 18 L21 18"
      to="M6 18 L18 6"
      dur="0.4s"
      fill="freeze"
      begin="indefinite"
      bind:this={bottomBarToX}
    />
    <animate
      attributeName="d"
      from="M6 18 L18 6"
      to="M3 18 L21 18"
      dur="0.4s"
      fill="freeze"
      begin="indefinite"
      bind:this={bottomBarToHamburger}
    />
  </path>
</svg>
