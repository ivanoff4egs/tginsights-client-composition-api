<script>
import useApiCall from "@/composables/apiClient.js";
import dataMixin from "@/mixins/dataMixin.vue";
import AppAlert from "@/components/App/AppAlert.vue";

export default {
  components: {AppAlert},
  data() {
    return {
      image: null,
    }
  },
  mixins: [dataMixin],
  async created() {
    this.loader = true
    const [error, response] = await useApiCall('GET', '/telegram/auth/qr')

    if (error) {
      this.error = error
    } else if (response) {
      this.image = `data:image/png;base64,${response.data.qr_code}`
    }

    this.loader = false
  }
}
</script>

<template>
  <div>

    <div v-if="loader" class="d-flex justify-content-center">
      <div class="spinner-border text-secondary" role="status"/>
    </div>

    <app-alert
      v-else-if="error"
      :message="error.response ? error.response.data.message : error.message"
      alert-class="alert-danger"
    />

    <div v-else-if="image" class="illustration mt-4 mb-4">
      <img :src="image" class="w-100" alt="gr code">
    </div>

  </div>
</template>

<style scoped>

</style>
