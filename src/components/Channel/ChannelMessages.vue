<script setup>
  import AppAlert from "@/components/App/AppAlert.vue";
  //import MessageSource from "@/components/MessageSource.vue";
  import useApiClient from "@/composables/apiClient.js";
  import {useRouter} from "vue-router";
  import MessageVersions from "@/components/Message/MessageVersions.vue";
  import {ref, onMounted} from "vue";
  import {formatDate} from "@/utils/functions.js";
  import AppTooltip from "@/components/App/AppTooltip.vue";
  import MatchedMessagesIcon from "@/components/App/Icons/MatchedMessagesIcon.vue";

  const router = useRouter()

  const props = defineProps({
      channel_id: {type: String, required: true}
  })

  const limit = ref(5)
  const limits = [5, 10, 25, 50]

  const {apiCallError, loader, response, callApi} = useApiClient()

  onMounted(() => {
    update()
  })

  const update = async () => {
    await callApi('GET', `/channel/messages/${props.channel_id}/${limit.value}`)
  }

</script>

<template>
  <div class="row messages">

    <div class="mt-4 flex align-items-center w-100 mb-4">
      <label class="font-weight-bold col-1">
        Last messages:
      </label>
      <select v-model="limit" class="custom-select col-11" @change="update">
        <option
          v-for="availableLimit in limits"
          :key="availableLimit"
          :value="availableLimit"
          :selected="{'selected': availableLimit === limit}"
        >{{ availableLimit }}</option>
      </select>

    </div>

    <div v-if="loader" class="d-flex justify-content-center w-100">
      <div class="spinner-border text-secondary" role="status"/>
    </div>

    <div v-if="apiCallError">
      <app-alert :message="apiCallError" @hide="apiCallError = null" />
    </div>

    <div v-if="response" class="col-12 mt-3">
      <div v-for="message in response.items" :key="message._id">
        <div class="card" :class="{'removed': message.removed}">
          <div class="card-body">
            <app-tooltip text="Matched messages" class="float-right" placement="bottom">
              <matched-messages-icon @click="router.push({name: 'message.matches', params: {id: messageId}})"/>
            </app-tooltip>

            <message-versions v-if="message.versions.length > 0" :versions="message.versions"/>
<!--
            <message-source @removed="markRemoved" :message="message"/>
-->
            <h5 class="card-title">{{ formatDate(message.date) }}</h5>
            <p><span>Processed: </span>{{ formatDate(message.created_at) }}</p>
            <p><span>Source ID: </span>{{ message.source_id }}</p>
            <p v-if="message.link"><span>Link: </span><a :href="message.link" target="_blank">{{ message.link }}</a></p>
            <hr/>
            <p class="card-text">{{ message.message }}</p>

          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<style scoped>
  .card.removed {
    border: 2px solid var(--ban-color);
    color: var(--ban-color)
  }

  .card p {
    margin: 0
  }

  .card p span {
    font-weight: bold;
  }

</style>
