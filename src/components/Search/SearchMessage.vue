<script setup>

//  import MessageSource from "@/components/Message/MessageSource.vue";
  import MatchedMessagesIcon from "@/components/App/Icons/MatchedMessagesIcon.vue";
  import MessageVersions from "@/components/Message/MessageVersions.vue";
  import {formatDate} from "@/utils/functions.js";
  import {reactive} from "vue";
  import AppTooltip from "@/components/App/AppTooltip.vue";
  import {useRouter} from "vue-router";

  const router = useRouter()

  const props = defineProps({
    message: {type: Object, required: true}
  })

  const localMessage = reactive({...props.message})

</script>

<template>
  <div class="col-12 mt-3 messages search">
    <div class="card" :class="{'removed': localMessage.removed}">
      <div class="card-body">
<!--
        <message-source @removed="markRemoved" :message="localMessage"/>
-->
        <app-tooltip text="Matched messages" class="float-right" placement="bottom">
          <matched-messages-icon @click="router.push({name: 'message.matches', params: {id: localMessage._id}})"/>
        </app-tooltip>

        <message-versions v-if="message.versions.length > 0" :versions="message.versions"/>

        <h5
            class="card-title channel-link"
            @click="router.push({'name': 'channel.view', 'params': {'source_id': localMessage.channel_source_id}})"
        >{{ localMessage.channel_name }}</h5>
        <h6>{{ formatDate(localMessage.date) }}</h6>
        <p><span>Processed at: </span>{{ formatDate(localMessage.created_at) }}</p>
        <p><span>Source ID: </span>{{ localMessage.source_id }}</p>
        <p v-if="localMessage.link"><span>Link: </span><a :href="localMessage.link" target="_blank">{{ localMessage.link }}</a></p>
        <hr/>
        <p class="card-text">{{ localMessage.message }}</p>
      </div>
    </div>
  </div>
</template>
<style>
  .messages .card {
    width: 100%;
    display: block;
  }

  .messages label {
    font-weight: bold;
  }

  .messages select {
    display: inline-flex;
    width: 5em;
  }

  .messages p {
    margin: 0;
  }

  .messages span {
    font-weight: bold;
  }

  .messages.search .channel-link {
    width: fit-content;
  }

  .messages.search .channel-link:hover {
    cursor: pointer;
    color: var(--active-link-color);
  }

  .messages .card.removed {
    border: 2px solid var(--ban-color);
    color: var(--ban-color)
  }
</style>
