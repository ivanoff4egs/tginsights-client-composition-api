import { defineStore } from "pinia";

export const useControlsStore = defineStore('channels', {
  state: () => ({
    channels: {
      filters: {
        active: true,
        name: ''
      },
      sortables: {
        'created_at': -1,
        'user_channels.subscribed_at': -1,
        'participants_count': -1,
        'processed_at': -1,
        'last_message_date': -1
      },
      currentSort: {'last_message_date': -1}
  }}),
})
