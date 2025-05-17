<script setup>
  import {formatDate} from "@/utils/functions.js";
  import {useRouter} from "vue-router";

  const props = defineProps({
    channel: {type: Object, required: true}
  })

  const router = useRouter();

</script>

<template>
  <tr @click="router.push({name: 'channel.view', params: {source_id: props.channel.source_id}})">
    <td>{{ props.channel.name }}</td>
    <td>{{ props.channel.participants_count }}</td>
    <td>{{ formatDate(props.channel.user_channels[0].subscribed_at) }}</td>
    <td>{{ formatDate(props.channel.user_channels[0].created_at) }}</td>
    <td>{{ formatDate(props.channel.processed_at) }}</td>
    <td>{{ formatDate(props.channel.last_message_date) }}</td>
    <td>
      <span v-if="props.channel.user_channels[0].active" class="td-icon active-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </svg>
      </span>
      <span v-else class="td-icon stopped-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-ban-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M2.71 12.584q.328.378.706.707l9.875-9.875a7 7 0 0 0-.707-.707l-9.875 9.875Z"/>
        </svg>
      </span>
    </td>
    <td>
      <span v-if="props.channel.user_channels[0].favorite" class="td-icon favorite-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
        </svg>
      </span>
    </td>
  </tr>

</template>
<style>
  .td-icon {
    display: flex;
    justify-content: center;
  }

  .td-icon.active-icon {
    color: var(--ok-color)
  }

  .td-icon.stopped-icon {
    color: var(--ban-color)
  }

  .td-icon.favorite-icon {
    color: var(--favorite-color)
  }
</style>
