<script>
  let { name, width, height } = $props();
</script>

{#if name === "chevron-left"}
  <svg fill="none" viewBox="0 0 14 14" {width} {height}
    ><path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 13 3 7l6-6"
    /></svg
  >
{:else if name === "chevron-right"}
  <svg fill="none" viewBox="0 0 14 14" {width} {height}
    ><path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m5 13 6-6-6-6"
    /></svg
  >
{/if}
