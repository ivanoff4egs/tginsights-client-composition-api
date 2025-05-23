<script setup>

  import AppTooltip from "@/components/App/AppTooltip.vue";
  import {useRouter} from "vue-router";
  import useApiClient from "@/composables/apiClient";
  import {useAuthStore} from "@/stores/auth.js";

  const router = useRouter()
  const {response, apiCallError, callApi} = useApiClient()
  const {setUnauthorized, username} = useAuthStore()

  const logOut = async () => {
    if (window.confirm('Are you sure?')) {
      await callApi('DELETE', '/logout')
      console.log()
      if (response.value && response.value.status === 204) {
        setUnauthorized()
        await router.replace({name: 'login'})
      }
    }
  }


</script>

<template>
  <AppTooltip :text="`User: ${username}`" :offset-distance="10">
    <div class="header-icon logout-icon" @click="logOut">
      <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
        <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
      </svg>
    </div>
  </AppTooltip>
</template>
<style scoped>
  .logout-icon {
    fill: white;
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .logout-icon:hover {
    fill: var(--active-link-color);
  }
</style>
