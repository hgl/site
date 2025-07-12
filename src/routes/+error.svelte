<script lang="ts">
  import PageLayout from "$lib/components/layouts/PageLayout.svelte";
  import { page } from "$app/state";
</script>

<PageLayout title={page.error?.message || "Not Found"}>
  Sorry, this page couldn't be found.
</PageLayout>
