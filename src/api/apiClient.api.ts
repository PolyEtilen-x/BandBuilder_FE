import axios from "axios"
import { getCookie } from "@/utils/cookie"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  withCredentials: true
})

// Attach Bearer token cho mobile web (desktop không bị ảnh hưởng)
apiClient.interceptors.request.use(
  (config) => {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
    if (isMobile) {
      const token = localStorage.getItem("accessToken")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

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

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)

    // Mobile: refresh bằng localStorage token
    if (isMobile) {
      try {
        if (!refreshPromise) {
          const storedRefreshToken = localStorage.getItem("refreshToken")
          refreshPromise = apiClient.post("/auth/refresh", { refreshToken: storedRefreshToken })
        }
        const res = await refreshPromise as any
        refreshPromise = null
        const { accessToken, refreshToken } = res.data
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", refreshToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return await apiClient(originalRequest)
      } catch (err) {
        refreshPromise = null
        throw err
      }
    }

    // Desktop: refresh bằng cookie (giữ nguyên như cũ)
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