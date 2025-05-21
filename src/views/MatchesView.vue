<script setup>
  import AppSidebar from "@/components/App/AppSidebar.vue";
  import SearchMessage from "@/components/Search/SearchMessage.vue";
  import AppAlert from "@/components/App/AppAlert.vue";
  import AppTooltip from "@/components/App/AppTooltip.vue";
  import useApiClient from "@/composables/apiClient";
  import {useRoute, useRouter} from "vue-router";
  import {onMounted} from "vue";
  import BackwardIcon from "@/components/App/Icons/BackwardIcon.vue";
  import AppPageHeader from "@/components/App/AppPageHeader.vue";

  const {response, apiCallError, loader, callApi} = useApiClient()
  const route = useRoute()
  const router = useRouter()

  onMounted(async () => {
    await callApi('GET', `/message/matches/${route.params.id}`)
  })

</script>

<template>
  <app-sidebar />

  <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">

    <app-page-header>
      <template #title>Matched messages</template>
      <template #icon-0>
        <app-tooltip text="Go back" class="float-right">
          <backward-icon @click="router.back()"/>
        </app-tooltip>
      </template>
    </app-page-header>

    <div v-if="loader" class="d-flex justify-content-center">
      <div class="spinner-border text-secondary" role="status"/>
    </div>

    <div v-if="apiCallError">
      <app-alert :message="apiCallError" @hide="apiCallError = null" />
    </div>

    <div v-if="response && response.total === 0">
      <div class="alert alert-dark" role="alert">
        Messages are not found.
      </div>
    </div>
    <div v-if="response && response.total > 0" class="message-matches">
      <search-message v-for="message in response.items" :message="message" :key="message._id"/>
    </div>

  </main>


</template>

<style scoped>

</style>
