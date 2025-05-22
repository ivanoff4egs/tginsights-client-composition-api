<script setup>
  import AppSidebar from "@/components/App/AppSidebar.vue";
  import AppPaginator from "@/components/App/AppPaginator.vue";
  import AppAlert from "@/components/App/AppAlert.vue";
  import TagEditPopup from "@/components/Tags/TagEditPopup.vue";
  import useApiClient from "@/composables/apiClient";
  import {formatDate} from "@/utils/functions.js"
  import {ref, onMounted} from "vue";
  import {BACKEND_QUERY_LIMIT} from "@/utils/constants.js";
  import AppPageHeader from "@/components/App/AppPageHeader.vue";


  const offset = ref(0)
  const editTagId = ref(null)
  const {loader, apiCallError, response, callApi} = useApiClient()
  const timeRanges = {hour: 'Last hour', day: 'Last day', week: 'Last week', month: 'Last month'}

  onMounted(() => {
    getTags()
  })

  const getTags = async () => {
      await callApi(
          'GET',
          'tags',
          {per_page: BACKEND_QUERY_LIMIT, offset: offset.value}
      )
  }

  const removeTag = async (id) => {
    if (window.confirm('Are you sure?')) {
      await callApi('DELETE', `/tag/remove/${id}`)

      if (response && response.status === 204) {
        await getTags()
      }
    }
  }
  const editTag = (id) => {
    editTagId.value = id
  }

  const handlePaginate = async (currentOffset) => {
    offset.value = currentOffset
    await getTags()
    window.scrollTo(0, 0)
  }

  const handleSaved = async () => {
    editTagId.value = null
    await getTags()
  }

</script>

<template>

  <app-sidebar />

  <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
    <app-page-header>
      <template #title>Tags</template>
    </app-page-header>

    <div v-if="loader" class="d-flex justify-content-center">
      <div class="spinner-border text-secondary" role="status"/>
    </div>

    <div v-if="apiCallError">
      <app-alert :message="apiCallError" @hide="apiCallError = null"/>
    </div>

    <div v-if="response && response.total === 0">
      <div class="alert alert-dark" role="alert">
        Tags are not found.
      </div>
    </div>

    <div v-if="response && response.total > 0" class="table-responsive">

      <table class="table tags-table">
        <thead class="thead-dark">
          <tr>
            <th>Name</th>
            <th>Value</th>
            <th>Time range</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Edit</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tag in response.items" :key="tag._id">
            <td>
              <router-link :to="{name: 'tag.search', params: {tagName: tag.name}}">
                #{{ tag.name }}
              </router-link>
            </td>
            <td>{{ tag.values.join(', ')}}</td>
            <td>{{ timeRanges[tag.timerange] }}</td>
            <td>{{ formatDate(tag.created_at) }}</td>
            <td>{{ formatDate(tag.updated_at) }}</td>
            <td>
              <span class="action tag-edit" @click="editTag(tag._id)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                </svg>
              </span>
            </td>
            <td>
              <span class="action tag-remove" @click="removeTag(tag._id)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                </svg>
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <keep-alive>
        <app-paginator
          v-if="response.total > BACKEND_QUERY_LIMIT"
          :total="response.total"
          @paginate="handlePaginate"
        />
      </keep-alive>

    </div>

    <tag-edit-popup
      v-if="editTagId"
      :id="editTagId"
      @saved="handleSaved"
      @close="editTagId = null"
      @keyup.esc="editTagId = null"
    />

  </main>

</template>
<style>
  .tags-table .action {
    width: 2em;
    display: flex;
    cursor: pointer;
  }

  .tags-table .action.tag-edit:hover {
    color: var(--active-link-color);
  }

  .tags-table .action.tag-remove:hover {
    color: var(--ban-color)
  }
</style>
