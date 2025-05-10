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
  import RefreshIcon from "@/components/App/Icons/RefreshIcon.vue";
  import StopIcon from "@/components/App/Icons/StopIcon.vue";
  import StartIcon from "@/components/App/Icons/StartIcon.vue";
  import FavoriteIcon from "@/components/App/Icons/FavoriteIcon.vue";
  import BackwardIcon from "@/components/App/Icons/BackwardIcon.vue";
  import AppPageHeader from "@/components/App/AppPageHeader.vue";

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
    } else if (action === ChannelActions.FAVORITE && !channel.value.user_channels[0].active) {
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

      <app-page-header>
        <template #title> {{ channel.name }} </template>
        <template #icon-0>
          <app-tooltip v-if="channel.user_channels[0].active" text="Update channel" class="float-right ml-2">
            <refresh-icon @click="getChannel" />
          </app-tooltip>
        </template>
        <template #icon-1>
          <app-tooltip text="Stop channel tracking" class="float-right ml-2" v-if="channel.user_channels[0].active" >
            <stop-icon @click="channelAction(ChannelActions.STOP)" />
          </app-tooltip>
          <app-tooltip text="Start channel tracking" class="float-right ml-2" v-if="!channel.user_channels[0].active">
            <start-icon @click="channelAction(ChannelActions.START)" />
          </app-tooltip>
        </template>
        <template #icon-2>
          <app-tooltip text="Add to favorites" class="float-right ml-2" v-if="!channel.user_channels[0].favorite" >
            <favorite-icon :is_favorite="false" classes="page-header-icon add-favorite-icon" @click="channelAction(ChannelActions.FAVORITE)" />
          </app-tooltip>
          <app-tooltip text="Remove from favorites" class="float-right ml-2" v-if="channel.user_channels[0].favorite">
            <favorite-icon :is_favorite="true" classes="page-header-icon remove-favorite-icon" @click="channelAction(ChannelActions.NOT_FAVORITE)"/>
          </app-tooltip>
        </template>
        <template #icon-3>
          <app-tooltip text="Go back" class="float-right ml-2">
            <backward-icon @click="router.back()" />
          </app-tooltip>
        </template>
      </app-page-header>

      <div class="row channel-data">

        <div class="col-6">
          <channel-chart :channel_id="channel._id">
            Chart couldn't be loaded.
          </channel-chart>
        </div>

        <div class="col-6 channel-info">
          <div class="row mb-1">
            <div class="col-2 font-weight-bold">Telegram ID: </div>
            <div class="col-10">{{ channel.source_id }}</div>
          </div>
          <div v-if="channel.username" class="row mb-1">
            <div class="col-2 font-weight-bold">Username: </div>
            <div class="col-10">
              <a :href="`https://t.me/${channel.username}`">
                {{ `@${channel.username}` }}
              </a>
            </div>
          </div>
          <div class="row mb-1">
            <div class="col-2 font-weight-bold">Description: </div>
            <div class="col-10">{{ channel.about }}</div>
          </div>
          <div class="row mb-1">
            <div class="col-2 font-weight-bold">Subscribed: </div>
            <div class="col-10">{{ formatDate(channel.user_channels[0].subscribed_at) }}</div>
          </div>
          <div class="row mb-1">
            <div class="col-2 font-weight-bold">Participants: </div>
            <div class="col-10">{{ channel.participants_count }}</div>
          </div>
          <div class="row mb-1">
            <div class="col-2 font-weight-bold">Processed: </div>
            <div class="col-10">{{ formatDate(channel.processed_at) }}</div>
          </div>

        </div>
      </div>

      <channel-messages :channel_id="channel._id" />

    </div>
  </main>

</template>
