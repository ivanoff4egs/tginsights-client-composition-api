import axios from "axios"
import useApiConfig from "@/composables/apiConfig"
import {useRouter} from "vue-router";
import {ref, reactive} from "vue";
import {useAuthStore} from "@/stores/auth.js";

export function useApiClient(ignore401Error = false) {

  const apiCallError = ref(null)
  const loader = ref(null)
  const response = reactive({})

  const axiosConfig = useApiConfig()
  const axiosInstance = axios.create(axiosConfig)

  const router = useRouter()
  const auth = useAuthStore()

  const callApi = async (httpMethod, path, query = null, payload = null) => {
    try {
      loader.value = true
      response.value = await axiosInstance.request({
        method: httpMethod,
        url: path,
        params: query,
        data: payload
      })
      loader.value = false

      return response
    } catch (error) {
      if (error.status === 401 && !ignore401Error) {
        auth.username = null
        auth.isAuthenticated = false
        await router.replace({name: 'login'})
      } else {
        apiCallError.value = error.response ? error.response.data : error.message
      }
    } finally {
      loader.value = false
    }
  }

  return [
    apiCallError,
    loader,
    response,
    callApi
  ]
}

