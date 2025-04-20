<script>
import AppSidebar from "@/components/AppSidebar.vue";
import AppAlert from "@/components/AppAlert.vue";
import AppPaginator from "@/components/AppPaginator.vue";
import TagEditPopup from "@/components/TagEditPopup.vue";
import AppTooltip from "@/components/AppTooltip.vue";
import SearchMessage from "@/components/SearchMessage.vue";
import useApiCall from "@/composables/apiClient";
import dataMixin from "@/mixins/dataMixin.vue";


export default {
  components: {AppTooltip, AppPaginator, AppAlert, AppSidebar, TagEditPopup, SearchMessage},
  mixins: [dataMixin],
  data() {
    return {
      searchValue: this.$route.params.searchValue,
      strict: this.$route.params.strict,
      timerange: this.$route.params.timerange,
      showSaveTag: false,
      tagSaved: false,
      newTag: {name: "", timerange: this.$route.params.timerange, values: [this.$route.params.searchValue]}
    }
  },
  created() {
    const path = `messages/search/${this.strict}/${this.timerange}`
    const query = {per_page: this.limit}
    this.callApi(path, query)
  },
  methods: {
    handlePaging(offset) {
      this.error = null

      const path = `messages/search/${this.strict}/${this.timerange}`
      const query = {per_page: this.limit, offset: offset}
      this.callApi(path, query)
    },
    handleSaved() {
      this.tagSaved = true
      this.closeSaveTag()
      window.scrollTo(0, 0)
    },
    closeSaveTag() {
      this.newTag = {name: "", timerange: this.$route.params.timerange, values: [this.$route.params.searchValue]}
      this.showSaveTag = false
    },
    addSearchValueInput() {
      this.newTag.values.push('')
    },
    removeSearchValueInput(index) {
      this.newTag.values.splice(index, 1)
    },

    async callApi(path, query=null) {
      this.loader = true

      const searchValue = this.searchValue.trim()
      if (!searchValue) {
        return false
      }

      const [error, response] = await useApiCall(
            'POST',
            path,
            query,
          {searchValue: searchValue}
        )

      if (error) {
        this.error = error
      } else if (response) {
        this.items = response.data.items
        this.total = response.data.total
        window.scrollTo(0, 0)
      }

      this.loader = false
    },
  }
}
</script>

<template>
  <app-sidebar />

  <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">

    <div v-if="tagSaved">
      <app-alert
          message="Tag saved"
          alert-class="alert-success"
          @hide-success="tagSaved = false"
      />
    </div>

    <div class="row border-bottom search-title mb-2">
      <div class="col-10">
        <h2>Messages search. Found: {{ total }}</h2>
      </div>
      <div class="col-2">
        <AppTooltip text="Save search tag" class="float-right">
          <div class="page-header-icon save-tag-icon" @click="showSaveTag = true">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
            </svg>
          </div>
        </AppTooltip>
        <AppTooltip text="Go back" class="float-right">
          <div class="page-header-icon back-icon mr-3" @click="$router.back()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
            </svg>
          </div>
        </AppTooltip>
      </div>
    </div>

    <div v-if="loader" class="d-flex justify-content-center">
      <div class="spinner-border text-secondary" role="status"/>
    </div>

    <div v-else-if="error">
      <app-alert
          alert-class="alert-danger"
          :message="error.message"
          @hide-error="error = null"
      />
    </div>

    <div v-else-if="items && !items.length">
      <div class="alert alert-dark" role="alert">
        Messages are not found.
      </div>
    </div>

    <div v-else-if="items" class="messages-search">
      <search-message v-for="message in items" :message="message" :key="message._id"/>
    </div>

    <app-paginator
        class="mt-4"
        v-if="total > limit"
        :total="total"
        :per_page="limit"
        @paginate="handlePaging"
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

  .save-tag-icon:hover {
    color: var(--active-link-color);
  }

</style>