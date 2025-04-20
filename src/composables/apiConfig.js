import {useCookies} from "vue3-cookies";

export default function useApiConfig() {

  const { cookies } = useCookies()
  const csrf_token = cookies.get('csrf_access_token')

  const headers = {
    "Content-Type": "application/json",
  }

  if (csrf_token) {
      headers["X-CSRF-TOKEN"] = csrf_token
  }

  return {
      baseURL: import.meta.env.VITE_APP_ROOT_API,
      withCredentials: true,
      headers: headers
  }
}
