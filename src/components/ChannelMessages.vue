<script setup>
  import AppAlert from "@/components/AppAlert.vue";
  //import MessageSource from "@/components/MessageSource.vue";
  import useApiClient from "@/composables/apiClient";
  //import MessageMatches from "@/components/MessageMatches.vue";
  //import MessageVersions from "@/components/MessageVersions.vue";
  import {ref, onMounted} from "vue";
  import {formatDate} from "@/functions.js";

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

    <div class="col-12 mt-4">
      <label class="font-weight-bold">
        Last messages
        <select v-model="limit" class="custom-select" @change="update">
          <option
            v-for="availableLimit in limits"
            :key="availableLimit"
            :value="availableLimit"
            :selected="{'selected': availableLimit === limit}"
          >{{ availableLimit }}</option>
        </select>
      </label>
    </div>

    <div v-if="loader" class="d-flex justify-content-center w-100">
      <div class="spinner-border text-secondary" role="status"/>
    </div>

    <div v-if="apiCallError" class="col-12 mt-3">
      <app-alert
        :message="apiCallError"
        alert-class="alert-danger"
        @hide-error="apiCallError = null"
      ></app-alert>
    </div>

    <div v-if="response" class="col-12 mt-3">
      <div v-for="message in response.items" :key="message._id">
        <div class="card" :class="{'removed': message.removed}">
          <div class="card-body">
<!--
            <message-source @removed="markRemoved" :message="message"/>
            <message-matches :message-id="message._id" />
            <message-versions v-if="message.versions.length > 0" :versions="message.versions"/>
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
