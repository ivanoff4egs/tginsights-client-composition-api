<script>
import enumsMixin from "@/mixins/enumsMixin.vue";
import AppAlert from "@/components/App/AppAlert.vue";
import dataMixin from "@/mixins/dataMixin.vue";
import useApiCall from "@/composables/apiClient";
import {nextTick} from "vue";

export default {
  components: {AppAlert},
  mixins: [enumsMixin, dataMixin],
  data() {
    return {
      currentStep: '',
      phoneCodeHash: null,
      context: this.$route.params.context,
      inputs: {
        phone: '',
        code: '',
        password: '',
      },

    }
  },
  created() {
    this.currentStep = this.$route.query.step ? this.$route.query.step : this.telegramAuthSteps.PHONE

  },
  watch: {
    currentStep() {
      nextTick(() => this.$refs.stepInput.focus())
    }
  },
  computed: {
    isSubmitEnabled() {
      return this.inputs[this.currentStep].length > 0
    }
  },
  methods: {

    async submitStep() {
      let payload = {context: this.context}
      switch (this.currentStep) {
        case this.telegramAuthSteps.PHONE:
          payload.phone = this.inputs.phone
          break
        case this.telegramAuthSteps.CODE:
          payload.phone = this.inputs.phone
          payload.code = this.inputs.code
          payload.phone_code_hash = this.phoneCodeHash
          break
        case this.telegramAuthSteps.PASSWORD:
          payload.password = this.inputs.password
          break
        default:
          console.log(`Unknown telegram auth step ${this.currentStep}`)
          return false
      }

      const [error, response] = await useApiCall(
          'POST',
          `/telegram/auth/${this.currentStep}`,
          null,
          payload
      )

      if (error) {
        this.error = error
      } else if (response.data.next_step) {
        this.currentStep = response.data.next_step

        if (this.currentStep === this.telegramAuthSteps.CODE) {
          this.phoneCodeHash = response.data.phone_code_hash
        }
      } else {
        this.$router.replace({name: 'home'})
      }
    },
  }
}
</script>

<template>
  <div class="login-dark">
    <form @submit.prevent="submitStep">
      <h2 class="text-center">Telegram Login</h2>

      <div class="illustration mt-4 mb-4">
        <img alt="telegram image" src="@/assets/telegram.png" class="w-100">
      </div>

      <app-alert
          v-if="error"
          :message="error.response ? error.response.data : error.message"
          alert-class="alert-danger"
          @hide-error="error = null"
      />

      <div class="form-group">
        <input
            v-if="currentStep === telegramAuthSteps.PHONE"
            v-model="inputs.phone"
            class="form-control"
            type="text"
            :name="currentStep"
            :placeholder="currentStep"
            maxlength="255"
            ref="stepInput"
        />
        <input
            v-if="currentStep === telegramAuthSteps.CODE"
            v-model="inputs.code"
            class="form-control"
            type="text"
            :name="currentStep"
            :placeholder="currentStep"
            maxlength="255"
            ref="stepInput"
        />
        <input
            v-if="currentStep === telegramAuthSteps.PASSWORD"
            v-model="inputs.password"
            class="form-control"
            type="password"
            :name="currentStep"
            :placeholder="currentStep"
            maxlength="255"
            ref="stepInput"
        />
      </div>

      <div class="form-group">
        <button
          type="submit"
          class="btn btn-primary btn-block mt-4"
          :class="{'disabled': !isSubmitEnabled}"
          :disabled="!isSubmitEnabled"
        >Submit</button>
      </div>

    </form>
  </div>
</template>

<style scoped>

</style>
