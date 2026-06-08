import axios from "axios"
import { getCookie } from "@/utils/cookie"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest", // CSRF signal: browsers block this header in cross-site form submissions
  },
})

let refreshPromise: Promise<unknown> | null = null

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    if (!error.response) throw error

    const status = error.response.status

    if (status !== 401) throw error

    const isLoggedIn = getCookie("bandbuilder-logged-in") === "true"
    if (!isLoggedIn) {
      throw error
    }

    if (originalRequest.url.includes("/auth/refresh")) {
      throw error
    }

    if (originalRequest._retry) {
      throw error
    }

    originalRequest._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = apiClient.post("/auth/refresh")
      }

      await refreshPromise
      refreshPromise = null

      return await apiClient(originalRequest)

    } catch (err) {
      refreshPromise = null
      throw err
    }
  }
)