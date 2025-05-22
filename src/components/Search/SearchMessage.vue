<script setup>

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

</script>

<template>
  <div class="col-12 mt-3 messages search">
    <div class="card" :class="{'removed': props.message.removed}">
      <div class="card-body">

        <app-tooltip text="Matched messages" class="float-right" placement="bottom">
          <matched-messages-icon @click="router.push({name: 'message.matches', params: {id: props.message._id}})"/>
        </app-tooltip>

        <message-versions v-if="props.message.versions.length > 0" :versions="props.message.versions"/>

        <h5
            class="card-title channel-link"
            @click="router.push({'name': 'channel.view', 'params': {'source_id': props.message.channel_source_id}})"
        >{{ props.message.channel_name }}</h5>
        <h6>{{ formatDate(props.message.date) }}</h6>
        <p><span>Processed at: </span>{{ formatDate(props.message.created_at) }}</p>
        <p><span>Source ID: </span>{{ props.message.source_id }}</p>
        <p v-if="props.message.link"><span>Link: </span><a :href="props.message.link" target="_blank">{{ props.message.link }}</a></p>
        <hr/>
        <p class="card-text">{{ props.message.message }}</p>
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
