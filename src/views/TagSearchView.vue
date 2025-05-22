<script setup>
  import AppSidebar from "@/components/App/AppSidebar.vue";
  import AppAlert from "@/components/App/AppAlert.vue";
  import AppPaginator from "@/components/App/AppPaginator.vue";
  import AppTooltip from "@/components/App/AppTooltip.vue";
  import useApiClient from "@/composables/apiClient";
  import SearchMessage from "@/components/Search/SearchMessage.vue";
  import {useRoute} from "vue-router";
  import {onMounted} from "vue";
  import AppPageHeader from "@/components/App/AppPageHeader.vue";
  import RefreshIcon from "@/components/App/Icons/RefreshIcon.vue";
  import {BACKEND_QUERY_LIMIT} from "@/utils/constants.js";

  const route = useRoute()

  const {loader, response, apiCallError, callApi} = useApiClient()

  onMounted(() => {
    getMessages()
  })

  const handlePaginate = async (offset) => {
    await getMessages(offset)
    window.scrollTo(0, 0)
  }

  const getMessages = async (offset=0) => {

    await callApi(
        'GET',
        `/messages/search/tag/${route.params.tagName}`,
        {per_page: BACKEND_QUERY_LIMIT, offset: offset}
    )
  }
</script>

<template>

  <app-sidebar/>

  <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">

    <app-page-header>
      <template #title>Search by Tag: #{{route.params.tagName}}</template>
      <template #icon-0>
        <app-tooltip text="Update search tag" class="float-right">
          <refresh-icon @click="getMessages"></refresh-icon>
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

    <div v-if="response && response.total > 0" class="mb-4">
      <search-message v-for="message in response.items" :message="message" :key="message._id"/>
    </div>

    <keep-alive>
      <app-paginator
        v-if="response && response.total > BACKEND_QUERY_LIMIT"
        :total="response.total"
        @paginate="handlePaginate"
      />
    </keep-alive>

  </main>
</template>

<style scoped>

  .update-icon:hover {
    color: var(--active-link-color)
  }

</style>
