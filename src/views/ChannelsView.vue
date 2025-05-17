<script setup>
  import AppSidebar from "@/components/App/AppSidebar.vue";
  import AppPaginator from "@/components/App/AppPaginator.vue";
  import AppSorting from "@/components/App/AppSorting.vue";
  import ChannelsChannel from "@/components/Channels/ChannelsChannel.vue";
  import AppAlert from "@/components/App/AppAlert.vue";
  import useApiClient from "@/composables/apiClient.js";
  import {useControlsStore} from "@/stores/controls.js";
  import {ref, onMounted, watch} from "vue";
  import {BACKEND_QUERY_LIMIT} from "@/utils/constants.js";
  import AppPageHeader from "@/components/App/AppPageHeader.vue";
  import AppTooltip from "@/components/App/AppTooltip.vue";
  import ResetIcon from "@/components/App/Icons/ResetIcon.vue";

  const {channelsPage, resetChannelsPage} = useControlsStore();

  const offset = ref(0)
  const sortables = {
    'created_at': -1,
      'user_channels.subscribed_at': -1,
      'participants_count': -1,
      'processed_at': -1,
      'last_message_date': -1
  }

  const statuses = {'Any': null, 'Active': true, 'Stopped': false}

  const {loader, apiCallError, response, callApi} = useApiClient()

  onMounted(() => {
    getChannels()
  })

  watch(channelsPage.filters, () => {
    offset.value = 0
  })

  const getRequestQuery = () => {

    const sortBy = Object.keys(channelsPage.currentSort)[0]

    const query = {
      per_page: BACKEND_QUERY_LIMIT,
      offset: offset.value,
      sort_by: sortBy,
      sort_dir: channelsPage.currentSort[sortBy]
    }

    if (channelsPage.filters.name) {
      query.name = channelsPage.filters.name
    }

    if (channelsPage.filters.active !== null) {
      query.active = channelsPage.filters.active
    }

    return query
  }
  const getChannels = async () => {
    const query = getRequestQuery()
    await callApi('GET', '/channels', query)
  }

  const handlePaginate = async (currentOffset) => {
      offset.value = currentOffset
      await getChannels()
  }

  const handleSort = async (sortParams) => {
      channelsPage.currentSort = sortParams
      await getChannels()
  }

  const reset = async () => {
    resetChannelsPage()
    await getChannels()
  }

</script>
<template>

  <app-sidebar/>

  <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">

    <app-page-header>
      <template #title>Channels</template>
      <template #icon-0>
        <app-tooltip text="Reset filters" class="float-right">
          <reset-icon @click="reset" />
        </app-tooltip>
      </template>
    </app-page-header>

    <div class="filters mb-3">

      <div class="form-group">
        <label class="font-weight-bold">Status:</label>
        <select v-model="channelsPage.filters.active" class="custom-select" @change="getChannels">
          <option
            v-for="(value, name) in statuses"
            :key="name"
            :value="value"
            :selected="{'selected': channelsPage.filters.active === value}"
          >{{ name }}</option>
        </select>
      </div>

      <div class="form-group row">
        <label class="font-weight-bold col-12">Name:</label>
        <div class="col-11">
          <input type="text" v-model="channelsPage.filters.name" class="form-control" maxlength="256">
        </div>
        <div class="col-1">
          <button
            class="btn btn-dark float-right search"
            :class="{'disabled': channelsPage.filters.name.length < 3}"
            @click="getChannels"
          >search</button>
        </div>
      </div>

    </div>

    <div v-if="loader" class="d-flex justify-content-center">
      <div class="spinner-border text-secondary" role="status"/>
    </div>

    <div v-if="apiCallError">
      <app-alert :message="apiCallError" @hide="apiCallError = null"/>
    </div>

    <div v-if="response && response.total === 0">
      <div class="alert alert-dark" role="alert">
        Channels are not found.
      </div>
    </div>

    <div v-if="response && response.total > 0">
      <div class="table-responsive">
        <table class="table table-hover channels-table">
          <thead class="thead-dark">
          <tr>
            <th>Name</th>
            <th>
              Participants
              <app-sorting
                sort-by="participants_count"
                :sort-dir="
                  'participants_count' in channelsPage.currentSort ?
                  channelsPage.currentSort['participants_count'] :
                  sortables['participants_count']"
                :active="'participants_count' in channelsPage.currentSort"
                @sort="handleSort"
              />
            </th>
            <th>
              Subscribed at
              <app-sorting
                sort-by="user_channels.subscribed_at"
                :sort-dir="
                  'user_channels.subscribed_at' in channelsPage.currentSort ?
                  channelsPage.currentSort['user_channels.subscribed_at'] :
                  sortables['user_channels.subscribed_at']
                "
                :active="'user_channels.subscribed_at' in channelsPage.currentSort"
                @sort="handleSort"
              />
            </th>
            <th>
              Record Created
              <app-sorting
                sort-by="created_at"
                :sort-dir="
                  'created_at' in channelsPage.currentSort ?
                  channelsPage.currentSort['created_at'] :
                  sortables['created_at']
                "
                :active="'created_at' in channelsPage.currentSort"
                @sort="handleSort"
              />
            </th>
            <th>
              Record Processed
              <app-sorting
                sort-by="processed_at"
                :sort-dir="
                  'processed_at' in channelsPage.currentSort ?
                  channelsPage.currentSort['processed_at'] :
                  sortables['processed_at']
                "
                :active="'processed_at' in channelsPage.currentSort"
                @sort="handleSort"
              />
            </th>
            <th>
              Last message
              <app-sorting
                sort-by="last_message_date"
                :sort-dir="
                  'last_message_date' in channelsPage.currentSort ?
                  channelsPage.currentSort['last_message_date'] :
                  sortables['last_message_date']
                "
                :active="'last_message_date' in channelsPage.currentSort"
                @sort="handleSort"
              />
            </th>
            <th>Active</th>
            <th>Favorite</th>
          </tr>
          </thead>
          <tbody>
            <channels-channel v-for="channel in response.items" :key="channel._id" :channel="channel"/>
          </tbody>
        </table>
      </div>
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

  .filters button.search:not(.disabled):hover {
    border-color: var(--active-link-color);
    background-color: var(--active-link-color);
  }

  .channels-table tbody tr {
    cursor: pointer;
  }
</style>
