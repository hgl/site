<script lang="ts">
  import PageLayout from "$lib/components/layouts/PageLayout.svelte";
  import { pageTitle } from "$lib/util";
  import Content from "./content.sveltemd";
  import emailIcon from "$lib/assets/email.svg";
  import githubIcon from "$lib/assets/github.svg";
  import linkedinIcon from "$lib/assets/linkedin.svg";
  import profilePic from "$lib/assets/profile-pic.jpg";
</script>

<svelte:head>
  <title>{pageTitle("About")}</title>
</svelte:head>

<PageLayout title="About">
  <!-- svelte-ignore a11y_img_redundant_alt -->
  <img class="profile-pic" src={profilePic} alt="Profile Picture" />
  <Content />
  <div class="contact">
    <a data-sveltekit-reload href="mailto:me@glenhuang.com"
      ><img src={emailIcon} alt="Email" /> me@glenhuang.com</a
    >
    <a data-sveltekit-reload href="https://github.com/hgl"
      ><img src={githubIcon} alt="GitHub" /></a
    >
    <a data-sveltekit-reload href="https://www.linkedin.com/in/hihgl/"
      ><img src={linkedinIcon} alt="LinkedIn" /></a
    >
  </div>
</PageLayout>

<style>
  .contact {
    display: flex;
    gap: 1.2em;
    font: 18px/1 var(--sans-serif-fonts);
    border-top: 1px solid #ddd;
    padding: 0.8em 0;
    margin-top: 40px;
    a {
      display: flex;
      align-items: center;
      gap: 0.3em;
      text-decoration: none;
    }
    img {
      height: 26px;
      aspect-ratio: 1;
    }
  }
  .profile-pic {
    display: block;
    margin: 40px 0;
    width: 200px;
    aspect-ratio: 1;
    border-radius: 50%;
  }
  @media (min-width: 680px) {
    .contact {
      margin-top: 60px;
    }
  }
</style>
