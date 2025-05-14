<script setup>
  import AppSidebar from "@/components/App/AppSidebar.vue";
  import AppAlert from "@/components/App/AppAlert.vue";
  import AppPaginator from "@/components/App/AppPaginator.vue";
  import TagEditPopup from "@/components/TagEditPopup.vue";
  import AppTooltip from "@/components/App/AppTooltip.vue";
  import SearchMessage from "@/components/SearchMessage.vue";
  import {useRoute, useRouter} from "vue-router";
  import useApiClient from "@/composables/apiClient";
  import {onMounted, reactive, ref} from "vue";
  import {BACKEND_QUERY_LIMIT} from "@/utils/constants.js";
  import AppPageHeader from "@/components/App/AppPageHeader.vue";
  import SaveIcon from "@/components/App/Icons/SaveIcon.vue";
  import BackwardIcon from "@/components/App/Icons/BackwardIcon.vue";

  const route = useRoute()
  const router = useRouter()

  const {response, apiCallError, loader, callApi} = useApiClient()

  const showSaveTag =ref(false)

  const newTag = reactive({
    name: "",
    timeRange: route.query.timeRange,
    values: [route.query.searchValue]
  })

  onMounted(() => {
    search(0)
  })
  const search = async (offset) => {

    await callApi(
      'GET',
      'messages/search',
      {
        strict: route.query.strict,
        time_range: route.query.timeRange,
        search_value: route.query.searchValue,
        per_page: BACKEND_QUERY_LIMIT,
        offset: offset
      }
    )
  }

  const handlePaginate = async (offset) => {
      await search(offset)
  }

  const handleSaved = () => {
      closeSaveTag()
      window.scrollTo(0, 0)
  }

  const closeSaveTag = () => {
      showSaveTag.value = false
  }

  const addSearchValueInput = () => {
      newTag.values.push('')
  }

  const removeSearchValueInput = (index) => {
      newTag.values.splice(index, 1)
  }

</script>

<template>
  <app-sidebar />

  <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">

    <app-page-header>
      <template #title> Messages search</template>
      <template #icon-0>
        <app-tooltip text="Save search tag" class="float-right ml-2">
          <save-icon @click="showSaveTag = true"/>
        </app-tooltip>
      </template>
      <template #icon-1>
        <app-tooltip text="Go back" class="float-right">
          <backward-icon @click="router.back()" />
        </app-tooltip>
      </template>
    </app-page-header>

    <div v-if="loader" class="d-flex justify-content-center">
      <div class="spinner-border text-secondary" role="status"/>
    </div>

    <div v-if="apiCallError">
      <app-alert :message="apiCallError"
          @hide-error="apiCallError = null"
      />
    </div>

    <div v-if="response && response.total === 0">
      <div class="alert alert-dark" role="alert">
        Messages are not found.
      </div>
    </div>

    <div v-if="response && response.total > 0" class="messages-search">
      <search-message v-for="message in response.items" :message="message" :key="message._id"/>
    </div>

    <app-paginator
        class="mt-4"
        v-if="response && response.total > BACKEND_QUERY_LIMIT"
        :total="response.total"
        :per_page="BACKEND_QUERY_LIMIT"
        @paginate="handlePaginate"
    />

    <tag-edit-popup
        v-model="newTag"
        :show="showSaveTag"
        @close="closeSaveTag"
        @add="addSearchValueInput"
        @remove="removeSearchValueInput"
        @saved="handleSaved"
        @keyup.esc="closeSaveTag"
    />

  </main>
</template>

<style scoped>

</style>
