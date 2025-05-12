<template>

  <app-sidebar/>

  <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">

    <div class="row channels-title border-bottom mb-2">

      <div class="col-10 mb-1">
        <h2>
          Channels
        </h2>
      </div>

      <div class="col-2">
        <AppTooltip text="Reset filters" class="float-right">
          <div class="page-header-icon reset-icon" @click="resetPage">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-c-circle" viewBox="0 0 16 16">
              <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.146 4.992c-1.212 0-1.927.92-1.927 2.502v1.06c0 1.571.703 2.462 1.927 2.462.979 0 1.641-.586 1.729-1.418h1.295v.093c-.1 1.448-1.354 2.467-3.03 2.467-2.091 0-3.269-1.336-3.269-3.603V7.482c0-2.261 1.201-3.638 3.27-3.638 1.681 0 2.935 1.054 3.029 2.572v.088H9.875c-.088-.879-.768-1.512-1.729-1.512"/>
            </svg>
          </div>
        </AppTooltip>
      </div>

    </div>

    <div class="filters mb-3">

      <div class="form-group">
        <label class="font-weight-bold">Status:</label>
        <select v-model="filters['active']" class="custom-select" @change="applyFilter">
          <option
              v-for="(value, name) in statuses"
              :key="name"
              :value="value"
              :selected="{'selected': filters['active'] === value}"
          >{{ name }}</option>
        </select>
      </div>

      <div class="form-group row">
        <label class="font-weight-bold col-12">Name:</label>
        <div class="col-11">
          <input type="text" v-model="filters['name']" class="form-control" maxlength="256">
        </div>
        <div class="col-1">
          <button
              class="btn btn-dark float-right search"
              :class="{'disabled': filters['name'].length < 3}"
              @click="applyFilter"
          >search</button>
        </div>
      </div>

    </div>

    <div v-if="loader" class="d-flex justify-content-center">
      <div class="spinner-border text-secondary" role="status"/>
    </div>

    <div v-else-if="error">
      <app-alert
          :message="error.message"
          alert-class="alert-danger"
          @hide-error="error = null"
      />
    </div>

    <div v-else-if="!items">
      <div class="alert alert-dark" role="alert">
        Channels are not found.
      </div>
    </div>

    <div v-else-if="items && items.length">
      <div class="table-responsive">
        <table class="table table-hover channels-table">
          <thead class="thead-dark">
            <tr>
              <th>Name</th>
              <th>
                Participants
                <app-sorting
                  sort-by="participants_count"
                  :sort-dir="'participants_count' in currentSort ? currentSort['participants_count'] : sortables['participants_count']"
                  :active="'participants_count' in currentSort"
                  @sort="handleSort"
                />
              </th>
              <th>
                Subscribed at
                <app-sorting
                  sort-by="user_channels.subscribed_at"
                  :sort-dir="
                    'user_channels.subscribed_at' in currentSort
                    ? currentSort['user_channels.subscribed_at']
                    : sortables['user_channels.subscribed_at']
                  "
                  :active="'user_channels.subscribed_at' in currentSort"
                  @sort="handleSort"
                />
              </th>
              <th>
                Record Created
                <app-sorting
                  sort-by="created_at"
                  :sort-dir="'created_at' in currentSort ? currentSort['created_at'] : sortables['created_at']"
                  :active="'created_at' in currentSort"
                  @sort="handleSort"
                />
              </th>
              <th>
                Record Processed
                <app-sorting
                  sort-by="processed_at"
                  :sort-dir="'processed_at' in currentSort ? currentSort['processed_at'] : sortables['processed_at']"
                  :active="'processed_at' in currentSort"
                  @sort="handleSort"
                />
              </th>
              <th>
                Last message
                <app-sorting
                  sort-by="last_message_date"
                  :sort-dir="'last_message_date' in currentSort ? currentSort['last_message_date'] : sortables['last_message_date']"
                  :active="'last_message_date' in currentSort"
                  @sort="handleSort"
                />
              </th>
              <th>Active</th>
              <th>Favorite</th>
            </tr>
          </thead>
          <tbody>
            <channels-channel v-for="channel in items" :key="channel._id" :channel="channel"/>
          </tbody>
        </table>
      </div>
    </div>

    <app-paginator
      v-if="total > limit"
      :total="total"
      :per_page="limit"
      @paginate="handlePaging"
    />

  </main>
</template>
<script>
  import AppSidebar from "@/components/App/AppSidebar.vue";
  import AppPaginator from "@/components/App/AppPaginator.vue";
  import AppSorting from "@/components/App/AppSorting.vue";
  import AppTooltip from "@/components/App/AppTooltip.vue";
  import ChannelsChannel from "@/components/Channels/ChannelsChannel.vue";
  import AppAlert from "@/components/App/AppAlert.vue";
  import useApiCall from "@/composables/apiClient.js";
  import {useChannelsStore} from "@/stores/controls.js";
  import dataMixin from "@/mixins/dataMixin.vue";

  export default {
    components: {
      ChannelsChannel,
      AppSidebar,
      AppPaginator,
      AppAlert,
      AppSorting,
      AppTooltip
    },
    mixins: [dataMixin],
    data() {
      return {
        filters: useChannelsStore().filters,
        sortables: useChannelsStore().sortables,
        currentSort: useChannelsStore().currentSort,
        statuses: {'Any': null, 'Active': true, 'Stopped': false},
      }
    },
    async created() {
      await this.getChannels()
    },
    methods: {
      async handlePaging(offset) {
        this.offset = offset

        await this.getChannels()
      },
      async applyFilter() {
        if (this.filters['name'].length > 0 && this.filters['name'].length < 3) {
          return false
        }
        useChannelsStore().filters = this.filters

        await this.getChannels()
      },
      async handleSort(sortParams) {
        this.currentSort = useChannelsStore().currentSort = sortParams

        await this.getChannels()
      },
      async resetPage() {
        this.setDefaults()
        await this.getChannels()
      },
      setDefaults() {
        this.filters = useChannelsStore().filters = {
          'active': true,
          'name': '',
        }
        this.sortables = useChannelsStore().sortables = {
          'created_at': -1,
          'user_channels.subscribed_at': -1,
          'participants_count': -1,
          'processed_at': -1,
          'last_message_date': -1
        }
        this.currentSort = useChannelsStore().currentSort = {'last_message_date': -1}
      },
      async getChannels() {

        this.error = null
        this.loader = true

        const payload = this.getFilters()
        const query = this.getCurrentQuery()

        const [error, response] = await useApiCall( 'POST', '/channels', query, payload)

        if (error) {
          this.error = error
        } else if (response) {
          this.items = response.data.items
          this.total = response.data.total
          window.scrollTo(0, 0)
        }

        this.loader = false
      },
      getFilters() {
        return {filters: this.filters}
      },
      getCurrentQuery() {
        const sortBy = Object.keys(this.currentSort)[0]

        return {
          per_page: this.limit,
          offset: this.offset,
          sort_by: sortBy,
          sort_dir: this.currentSort[sortBy]
        }
      }
    }
  }
</script>
<style>

  .reset-icon:hover {
    color: var(--active-link-color);
  }

  .filters button.search:not(.disabled):hover {
    border-color: var(--active-link-color);
    background-color: var(--active-link-color);
  }

  .channels-table tbody tr {
    cursor: pointer;
  }
</style>
