<script setup>
  import AppSidebar from "@/components/App/AppSidebar.vue";
  import AppAlert from "@/components/App/AppAlert.vue";
  import AppTooltip from "@/components/App/AppTooltip.vue";
  import RefreshIcon from "@/components/App/Icons/RefreshIcon.vue";
  //import MessageSource from "@/components/MessageSource.vue";
  import useApiClient from "@/composables/apiClient";
  import MessageVersions from "@/components/Message/MessageVersions.vue";
  import {onMounted} from "vue";
  import {useRouter} from "vue-router";
  import {formatDate} from "@/utils/functions.js"
  import AppPageHeader from "@/components/App/AppPageHeader.vue";
  import FavoriteIcon from "@/components/App/Icons/FavoriteIcon.vue";
  import {ChannelActions} from "@/utils/constants.js";
  import MatchedMessagesIcon from "@/components/App/Icons/MatchedMessagesIcon.vue";

  const {apiCallError, loader, response, callApi} = useApiClient()
  const router = useRouter()

  onMounted(() => {
    getChannels()
  })

  const getChannels = async () => {
      await callApi('POST', '/channels/favorites')
  }

  const remove = async (channel_id) => {
    await callApi('PATCH', `channel/${channel_id}/${ChannelActions.NOT_FAVORITE}`)
    await getChannels()
  }

</script>

<template>
  <app-sidebar/>
  <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">

    <app-page-header>
      <template #title>Favorites</template>
      <template #icon-0>
        <app-tooltip text="Update channels" class="float-right">
          <refresh-icon @click="getChannels" />
        </app-tooltip>
      </template>
    </app-page-header>

    <div v-if="loader" class="d-flex justify-content-center">
      <div class="spinner-border text-secondary" role="status"/>
    </div>

    <app-alert v-if="apiCallError" :message="apiCallError" @hide-error="apiCallError = null" />

    <div v-if="response">
      <div
        v-for="channel in response.items"
        :key="channel._id"
        class="card mr-2 mb-2 favorites"
        :class="{'removed': channel.last_message.removed}"
      >
        <div class="card-body">
          <AppTooltip text="Remove from favorites" class="float-right" placement="bottom">
            <favorite-icon
              classes="page-content-icon remove-favorite-icon ml-1"
              :is_favorite="true"
              @click="remove(channel._id)"
            />
          </AppTooltip>

          <h5
            class="card-title channel-link"
            @click="router.push({'name': 'channel.view', 'params': {'id': channel._id}})"
          >{{channel.name}}</h5>
          <hr/>
          <h6>{{ formatDate(channel.last_message_date) }}</h6>
          <p><span class="font-weight-bold">Processed at:</span> {{ formatDate(channel.processed_at) }}</p>
          <hr/>
          <div class="message mb-3">
            <p class="card-text">{{channel.last_message.message}}</p>
          </div>

          <app-tooltip text="Matched messages" class="float-right" placement="bottom">
            <matched-messages-icon @click="router.push({name: 'message.matches', params: {id: messageId}})"/>
          </app-tooltip>

          <message-versions v-if="channel.last_message.versions.length > 0" :versions="channel.last_message.versions"/>

  <!--
          <message-source @removed="channel.last_message.removed = true" :message="channel.last_message"/>
  -->
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped>

  .favorites {
    width: 25em;
    display: inline-flex;
  }

  .favorites.removed h6,
  .favorites.removed p {
    color: var(--ban-color)
  }

  .favorites .card-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .favorites .message {
    overflow: hidden;
    height: 10em;
  }

  .favorites .channel-link {
    cursor: pointer;
  }

  .favorites .channel-link:hover {
    color: var(--active-link-color)
}
</style>
