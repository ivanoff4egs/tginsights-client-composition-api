<script setup>
  import HeaderSearch from "@/components/Header/HeaderSearch.vue";
  import HeaderLogOut from "@/components/Header/HeaderLogOut.vue";

  const appVersion = import.meta.env.VITE_APP_VERSION

</script>
<template>
  <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
    <a href="/" class="navbar-brand col-sm-3 col-md-2 mr-0">tgInsights <span class="version">v{{ appVersion }}</span></a>
    <header-search />
    <header-log-out />
    <!--
        <header-last-messages />
        <header-telegram-connection />

    -->
  </nav>
</template>
<style scoped>
  .navbar-brand {
    padding-top: .75rem;
    padding-bottom: .75rem;
    font-size: 1.25rem;
    font-weight: bold;
    background-color: rgba(0, 0, 0, .25);
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, .25);
  }

  .version {
    font-weight: normal;
    font-size: small
  }

</style>
