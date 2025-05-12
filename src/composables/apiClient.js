import axios from "axios"
import useApiConfig from "@/composables/apiConfig"
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import {useAuthStore} from "@/stores/auth.js";

export default function useApiClient(ignore401Error = false) {

  const apiCallError = ref(null)
  const loader = ref(null)
  const response = ref(null)

  const axiosConfig = useApiConfig()
  const axiosInstance = axios.create(axiosConfig)

  const router = useRouter()
  const route = useRoute()
  const auth = useAuthStore()

  const callApi = async (httpMethod, path, query = null, payload = null) => {

    loader.value = true
    apiCallError.value = null
    response.value = null

    try {
      const res = await axiosInstance.request({
        method: httpMethod,
        url: path,
        params: query,
        data: payload
      })

      response.value = res.status === 204 ? res : res.data
    } catch (error) {
      if (error.status === 401 && !ignore401Error) {
        auth.username = null
        auth.isAuthenticated = false
        await router.replace({name: 'login', query: {redirectedFrom: route.fullPath}})
      } else {
        apiCallError.value =
          error.response && error.response.data.length > 0 ?
            error.response.data :
            error.message
      }
    } finally {
      loader.value = false
    }
  }

  return {apiCallError, loader, response, callApi}
}

