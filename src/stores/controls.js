import { defineStore } from "pinia";
import {reactive} from "vue";

export const useControlsStore = defineStore('controls', () => {
  const getDefaultChannelsPage = () => {
    return {
      filters: {
        active: true,
        name: ''
      },
      currentSort: { 'last_message_date': -1 }
    }
  }

  const channelsPage = reactive(getDefaultChannelsPage())

  function resetChannelsPage() {
    const defaults = getDefaultChannelsPage()

    channelsPage.filters.active = defaults.filters.active
    channelsPage.filters.name = defaults.filters.name
    channelsPage.currentSort = defaults.currentSort
  }

  return {
    channelsPage,
    resetChannelsPage
  }
})
