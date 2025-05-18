import {defineStore} from "pinia"
import {ref} from "vue";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const isAuthorized = ref(false)
    const username = ref(null)

    const setAuthorized = (input_username) => {
      isAuthorized.value = true
      username.value = input_username
    }

    const setUnauthorized = () => {
      isAuthorized.value = false
      username.value = null
    }

    return {isAuthorized, username, setAuthorized, setUnauthorized}
  })

