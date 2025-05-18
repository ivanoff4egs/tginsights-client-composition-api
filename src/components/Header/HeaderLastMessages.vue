<script>
import AppPopup from "@/components/App/AppPopup.vue";
import AppTooltip from "@/components/App/AppTooltip.vue";
import dataMixin from "@/mixins/dataMixin.vue";
import formatDateMixin from "@/mixins/formatDateMixin.vue";
import useApiCall from "@/composables/apiClient.js";
import AppAlert from "@/components/App/AppAlert.vue";

export default {
  components: {AppAlert, AppTooltip, AppPopup},
  mixins: [dataMixin, formatDateMixin],
  data() {
    return {
      showPopup: false,
      limit: 10,
      offset: 0
    }
  },
  methods: {
    async togglePopup() {
      this.showPopup = !this.showPopup;
      this.items = []
      if (this.showPopup) {
        await this.updateMessages()
      }
    },
    async getMoreMessages() {
      this.offset += this.limit
      await this.updateMessages()
    },
    async updateMessages() {
      this.loader = true
      const [error, response] = await useApiCall(
          'POST',
          '/messages/last',
          {},
          {
            limit: this.limit,
            offset: this.offset
          }
      );
      this.loader = false
      if (error) {
        this.error = error;
      } else if (response && response.data) {
        this.items = this.items.concat(response.data.items)
      }
    }
  }
}

</script>

<template>
  <app-tooltip text="Last messages" :offset-distance="10">
    <div class="header-icon last-messages-icon" @click="togglePopup">
      <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-envelope" viewBox="0 0 16 16">
        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
      </svg>
    </div>
  </app-tooltip>
  <app-popup
      title="Last messages"
      :show="showPopup"
      :show-save-button="false"
      @close-modal="togglePopup"
      @keyup.esc="togglePopup"
  >
    <div v-if="error">
      <app-alert
        :message="error.message"
        alert-class="alert-danger"
        @hide-error="error = null"
      />
    </div>

    <div v-else-if="items.length > 0" class="last-messages">
      <div v-for="message in items" :key="message.id" class="p-2 m-2" :class="{'removed': message.removed, 'border': !message.removed}">
        <h5>{{ message.channel_name }}</h5>
        <p class="font-weight-bold">{{ formatDate(message.date) }}</p>
        <p>{{ message.message }}</p>
      </div>
      <div v-if="loader" class="d-flex justify-content-center">
        <div class="spinner-border text-secondary" role="status"/>
      </div>
      <button v-else class="btn btn-dark" @click="getMoreMessages">10 more...</button>
    </div>
  </app-popup>
</template>

<style scoped>
  .last-messages-icon {
    margin-right: 0.5rem;
    fill: white;
  }

  .last-messages-icon:hover {
    fill: var(--active-link-color)
  }

  .last-messages {
    max-height: 20rem;
    overflow-y: scroll;
    overflow-x: auto;
  }

  .last-messages .removed {
    border: 1px solid var(--ban-color);
    color: var(--ban-color)
  }

</style>
