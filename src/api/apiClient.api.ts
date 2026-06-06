import axios from "axios"
import { getCookie } from "@/utils/cookie"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  withCredentials: true
})

// Request interceptor to attach Bearer token ONLY on mobile web clients
apiClient.interceptors.request.use(
  (config) => {
    const isMobileBrowser = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
    if (isMobileBrowser) {
      const token = localStorage.getItem("accessToken")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

let refreshPromise: Promise<any> | null = null

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

    const isMobileBrowser = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)

    // Token refresh for mobile web (using body)
    if (isMobileBrowser) {
      try {
        if (!refreshPromise) {
          const localRefreshToken = localStorage.getItem("refreshToken")
          refreshPromise = apiClient.post("/auth/refresh", {
            refreshToken: localRefreshToken
          })
        }

        const refreshRes = await refreshPromise
        refreshPromise = null

        const { accessToken, refreshToken } = refreshRes.data
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", refreshToken)

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return await apiClient(originalRequest)

      } catch (err) {
        refreshPromise = null
        throw err
      }
    }

    // Default cookie refresh flow for desktop web
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