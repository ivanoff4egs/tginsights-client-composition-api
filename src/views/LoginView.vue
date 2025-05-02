<script setup>
  import AppAlert from "@/components/AppAlert.vue";
  import useApiClient from "@/composables/apiClient.js";
  import {useRoute, useRouter} from "vue-router";
  import {useAuthStore} from "@/stores/auth";
  import {ref, computed} from "vue";

  const username = ref('')
  const password = ref('')
  const redirectTo = ref('/')

  const route = useRoute()
  const router = useRouter()

  const isSubmitEnabled = computed(() => {
    return username.value.length > 0 && password.value.length > 0
  })

  const {apiCallError, loader, response, callApi} = useApiClient(true)

  const submitCredentials = async () => {

    if (isSubmitEnabled) {
      const payload = {
        'username': username.value,
        'password': password.value
      }

      await callApi('POST', '/login', null, payload)

      if (response.value.status === 204) {
        const auth = useAuthStore()
        auth.isAuthenticated = true
        auth.username = username.value

        if (route.query.redirectedFrom) {
          redirectTo.value = route.query.redirectedFrom
        }

        await router.replace({path: redirectTo.value})
      }
    }
  }
</script>

<template>
  <div class="login-dark">
    <form @submit.prevent="submitCredentials">
      <h2 class="text-center">tgInsights</h2>
      <div class="illustration mt-4 mb-4">
        <img alt="lock image" src="@/assets/padlock.png" class="w-100">
      </div>

      <div v-if="loader" class="d-flex justify-content-center">
        <div class="spinner-border text-secondary" role="status"/>
      </div>

      <AppAlert
          v-if="apiCallError"
          :message="apiCallError"
          alert-class="alert-danger"
          @hide-alert="apiCallError = null"
      />

      <div v-if="!loader" class="form-group">
        <input
          v-model="username"
          class="form-control"
          type="text"
          name="username"
          placeholder="Username"
          maxlength="255"
        >
        </div>
        <div class="form-group">
          <input
            v-model="password"
            class="form-control"
            type="password"
            name="password"
            placeholder="Password"
            maxlength="255"
          >
        </div>
        <div class="form-group">
          <button
            type="submit"
            class="btn btn-primary btn-block mt-4"
            :class="{'disabled': !isSubmitEnabled}"
            :disabled="!isSubmitEnabled"
          >Log In</button>
        </div>
    </form>
  </div>

</template>
<style scoped>

  .login-dark .illustration img {
    filter: invert(1);
  }

</style>
