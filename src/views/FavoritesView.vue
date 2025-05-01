<script setup>
  import AppSidebar from "@/components/AppSidebar.vue";
  import AppAlert from "@/components/AppAlert.vue";
  import AppTooltip from "@/components/AppTooltip.vue";
  //import MessageSource from "@/components/MessageSource.vue";
  import useApiClient from "@/composables/apiClient";
  //import MessageMatches from "@/components/MessageMatches.vue";
  //import MessageVersions from "@/components/MessageVersions.vue";
  import {onMounted} from "vue";
  import {formatDate} from "@/functions.js"

  const {apiCallError, loader, response, callApi} = useApiClient()

  onMounted(() => {
    getChannels()
  })
  const getChannels = async () => {
      await callApi('POST', '/channels/favorites')
  }

  const remove = async (channel_id) => {
    await callApi('PATCH', `channel/${channel_id}/dislike`)
  }

</script>

<template>
  <app-sidebar/>
  <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
    <div class="row favorites-title border-bottom mb-2">
      <div class="col-10">
        <h2>
          Favorites
        </h2>
      </div>
        <div class="col-2">
          <AppTooltip text="Update channels" class="float-right">
            <div class="page-header-icon update-icon" @click="getChannels()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
              </svg>
            </div>
          </AppTooltip>
        </div>
    </div>

    <div v-if="loader" class="d-flex justify-content-center">
      <div class="spinner-border text-secondary" role="status"/>
    </div>

    <div v-if="apiCallError">
      <app-alert
          :message="apiCallError"
          alert-class="alert-danger"
          @hide-error="apiCallError = null"
      />
    </div>

    <div v-if="response">
      <div
        v-for="channel in response.items"
        :key="channel._id"
        class="card mr-2 mb-2 favorites"
        :class="{'removed': channel.last_message.removed}"
      >
        <div class="card-body">
          <AppTooltip text="Remove from favorites" class="float-right" placement="bottom">
            <div class="page-content-icon remove-favorite-icon ml-1" @click="remove(channel._id)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
              </svg>
            </div>
          </AppTooltip>
          <h5
            class="card-title channel-link"
            @click="$router.push({'name': 'channel.view', 'params': {'id': channel._id}})"
          >{{channel.name}}</h5>
          <hr/>
          <h6>{{ formatDate(channel.last_message_date) }}</h6>
          <p><span class="font-weight-bold">Processed at:</span> {{ formatDate(channel.processed_at) }}</p>
          <hr/>
          <div class="message mb-3">
            <p class="card-text">{{channel.last_message.message}}</p>
          </div>
  <!---
          <message-source @removed="channel.last_message.removed = true" :message="channel.last_message"/>
          <message-matches :message-id="channel.last_message._id"/>
          <message-versions v-if="channel.last_message.versions.length > 0" :versions="channel.last_message.versions"/>
  -->
        </div>
      </div>
    </div>
  </main>
</template>
<style>

  .update-icon:hover {
    color: var(--active-link-color);
  }

  .favorites {
    width: 25em;
    display: inline-flex;
  }

  .remove-favorite-icon:hover {
    color: var(--favorite-color);
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
