<script setup>
  import {RouterView} from 'vue-router'
  import {useRoute} from "vue-router";
  import AppHeader from "@/components/AppHeader.vue";

  const searchSubmit = (data, strict, timerange) => {
    useRoute().push({
      name: 'messages.search',
      params: {searchValue: data, strict: strict, timerange: timerange}
    })
  }
</script>

<template>
  <AppHeader @search-submit="(data, strict, timerange) => searchSubmit(data, strict, timerange)" />
  <div class="container-fluid">
    <div class="row">
      <RouterView :key="useRoute().fullPath"/>
    </div>
  </div>
</template>

<style scoped>
  :root {
    --main-font-color: #212529;
    --active-link-color: #007bff;
    --ban-color: #bd2130;
    --ok-color: #007000;
    --favorite-color: #c5c51c;
  }

  #app {
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    color: var(--main-font-color);
    background-color: white;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    overflow-x: hidden;
  }

  .bi {
    vertical-align: text-top;
  }

  .border-top { border-top: 1px solid var(--main-font-color); }
  .border-bottom { border-bottom: 1px solid var(--main-font-color); }


  @keyframes spinner-border {
    to { transform: rotate(360deg); }
  }

  .spinner-border {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    vertical-align: text-bottom;
    border: 0.25em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spinner-border .75s linear infinite;
  }

  .spinner-border-sm {
    width: 1rem;
    height: 1rem;
    border-width: 0.1em;
  }

  .page-header-icon, .header-icon {
    width: 3em;
    cursor: pointer
  }

  .page-content-icon {
    width: 1.5em;
    cursor: pointer
  }

  .page-header-icon.back-icon:hover {
    color: var(--active-link-color)
  }

  .login-dark {
    max-width:320px;
    width:90%;
    background-color: var(--main-font-color);
    padding:40px;
    border-radius:5px;
    transform:translate(-50%, -50%);
    position:absolute;
    top:50%;
    left:50%;
    color:white;
  }

  .login-dark form .form-control {
    background:none;
    border:none;
    border-bottom:3px solid white;
    border-radius:5px;
    outline:none;
    color:white;
  }

  .login-dark form .form-control:focus {
    color:var(--main-font-color);
    background:white;
  }

  .login-dark form .btn-primary {
    background:none;
    border:3px solid white;
    border-radius:5px;
    padding:10px;
    outline:none;
  }

  .login-dark form .btn-primary:not(.disabled):hover {
    background-color: white;
    font-weight: 800;
    color: var(--main-font-color);
  }
</style>
