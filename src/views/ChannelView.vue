<script setup>
  import AppSidebar from "@/components/App/AppSidebar.vue";
  import ChannelChart from "@/components/Channel/ChannelChart.vue";
  import AppAlert from "@/components/App/AppAlert.vue";
  import ChannelMessages from "@/components/Channel/ChannelMessages.vue";
  import AppTooltip from "@/components/App/AppTooltip.vue";
  import useApiClient from "@/composables/apiClient";
  import {onMounted} from "vue";
  import {useRoute, useRouter} from "vue-router";
  import {ChannelActions} from "@/utils/constants.js";
  import {formatDate} from "@/utils/functions.js";

  const {apiCallError, loader, response, callApi} = useApiClient()
  const channel = response

  const route = useRoute()
  const router = useRouter()

  onMounted(() => {
    getChannel()
  })

  const getChannel = async () => {
    await callApi('POST', `channel/${route.params.id}`)
  }

  const channelAction = async (action) => {

    if (loader.value) {
      return false
    }

    if (action === ChannelActions.STOP && channel.value.user_channels[0].favorite) {
      if (!window.confirm('Channel is favorite. Are you sure?')) {
        return false
      }
    } else if (action === ChannelActions.LIKE && !channel.value.user_channels[0].active) {
      if (!window.confirm('Channel is stopped. Continue?')) {
        return false
      }
    }

    await callApi('PATCH', `channel/${route.params.id}/${action}`)
  }
</script>

<template>

  <app-sidebar />

  <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">

    <div v-if="loader" class="d-flex justify-content-center">
      <div class="spinner-border text-secondary" role="status"/>
    </div>

    <app-alert v-if="apiCallError" :message="apiCallError" @hide-error="apiCallError = null" />

    <div v-if="channel">
      <div class="row channel-title border-bottom mb-2">

        <div class="col-9 ">
          <h2>
            {{ channel.name }}
          </h2>
        </div>

        <div class="col-3">

          <AppTooltip v-if="channel.user_channels[0].active" text="Update channel" class="float-right ml-2">
            <div class="page-header-icon update-icon" @click="getChannel">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
              </svg>
            </div>
          </AppTooltip>

          <AppTooltip text="Stop channel tracking" class="float-right ml-2">
            <div class="page-header-icon stop-icon" v-if="channel.user_channels[0].active" @click="channelAction(ChannelActions.STOP)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-stop-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                <path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5z"></path>
              </svg>
            </div>
          </AppTooltip>

          <AppTooltip text="Start channel tracking" class="float-right ml-2">
            <div class="page-header-icon start-icon" v-if="!channel.user_channels[0].active" @click="channelAction(ChannelActions.START)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-play-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
              </svg>
            </div>
          </AppTooltip>

          <AppTooltip text="Add to favorites" class="float-right ml-2">
            <div class="page-header-icon add-favorite-icon" v-if="!channel.user_channels[0].favorite" @click="channelAction(ChannelActions.LIKE)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
              </svg>
            </div>
          </AppTooltip>

          <AppTooltip text="Remove from favorites" class="float-right ml-2">
            <div class="page-header-icon remove-favorite-icon" v-if="channel.user_channels[0].favorite" @click="channelAction(ChannelActions.DISLIKE)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
              </svg>
            </div>
          </AppTooltip>

          <AppTooltip text="Go back" class="float-right ml-2">
            <div class="page-header-icon back-icon" @click="router.back()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
              </svg>
            </div>
          </AppTooltip>
        </div>

      </div>
      <div class="row channel-data">

        <div class="col-6">
          <channel-chart :channel_id="channel._id">
            Chart couldn't be loaded.
          </channel-chart>
        </div>

        <div class="col-6 channel-info">
          <div class="row mb-1">
            <div class="col-2 label">Telegram ID: </div>
            <div class="col-10">{{ channel.source_id }}</div>
          </div>
          <div v-if="channel.username" class="row mb-1">
            <div class="col-2 label">Username: </div>
            <div class="col-10">
              <a :href="`https://t.me/${channel.username}`">
                {{ `@${channel.username}` }}
              </a>
            </div>
          </div>
          <div class="row mb-1">
            <div class="col-2 label">Description: </div>
            <div class="col-10">{{ channel.about }}</div>
          </div>
          <div class="row mb-1">
            <div class="col-2 label">Subscribed: </div>
            <div class="col-10">{{ formatDate(channel.user_channels[0].subscribed_at) }}</div>
          </div>
          <div class="row mb-1">
            <div class="col-2 label">Participants: </div>
            <div class="col-10">{{ channel.participants_count }}</div>
          </div>
          <div class="row mb-1">
            <div class="col-2 label">Processed: </div>
            <div class="col-10">{{ formatDate(channel.processed_at) }}</div>
          </div>

        </div>
      </div>

      <channel-messages :channel_id="channel._id"></channel-messages>

    </div>
  </main>

</template>
<style scoped>

  .stop-icon:hover {
    color: var(--ban-color);
  }

  .start-icon:hover {
    color: var(--ok-color)
  }

  .remove-favorite-icon:hover {
    color: var(--favorite-color);
  }

  .add-favorite-icon:hover {
    color: var(--favorite-color);
  }

  .update-icon:hover  {
    color: var(--active-link-color);
  }

  .channel-data .label,
  .channel-data label {
    font-weight: bold;
  }

  .channel-data .channel-info {
    margin-top: 4em;
  }
</style>
