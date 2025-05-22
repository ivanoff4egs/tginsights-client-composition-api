<script>
import AppAlert from "@/components/App/AppAlert.vue";
import dataMixin from "@/mixins/dataMixin.vue";
import enumsMixin from "@/mixins/enumsMixin.vue";
import useApiCall from "@/composables/apiClient";
import TelegramAuthQR from "@/components/TelegramAuth/TelegramAuthQR.vue";

export default {
  components: {AppAlert, TelegramAuthQR},
  mixins: [dataMixin, enumsMixin],
  data() {
    return {
      context: this.$route.params.context
    }
  },
  async created() {

    const [error, response] = await useApiCall(
        'POST',
        '/telegram/auth/qr/login',
        null,
        {context: this.context}
    )

    if (error) {
      this.error = error
    } else if (response) {
      if (response.data.next_step) {
        this.$router.replace({
          name: 'telegram.auth',
          params: {context: this.context},
          query: {step: this.telegramAuthSteps.PASSWORD}
        })
      } else {
        this.$router.replace({name: 'home'})
      }
    }
  },
}
</script>

<template>
  <div class="login-dark">
    <form>
      <h2 class="text-center">Telegram Login</h2>
      <p>Scan QR code with your Mobile Telegram App</p>

      <app-alert
        v-if="error"
        :message="error.response ? error.response.data.message : error.message"
        alert-class="alert-danger"
      />

      <TelegramAuthQR></TelegramAuthQR>

      <p>or log in with your credentials</p>
      <div class="form-group">
        <button
          @click="$router.replace({name: 'telegram.auth'})"
          type="button"
          class="btn btn-primary btn-block mt-4"
        >Log in with credentials</button>
      </div>

    </form>
  </div>
</template>

<style scoped>
  form p {
    text-align: center;
  }
</style>
