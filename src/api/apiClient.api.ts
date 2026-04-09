import axios from "axios"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true
})

let isRefreshing = false
let refreshSubscribers: (() => void)[] = []

function subscribeTokenRefresh(cb: () => void) {
  refreshSubscribers.push(cb)
}

function onRefreshed() {
  refreshSubscribers.forEach((cb) => cb())
  refreshSubscribers = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // ❗ bỏ qua /auth/me (KHÔNG trigger refresh/login)
    if (originalRequest.url.includes("/auth/me")) {
      return Promise.reject(error)
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error)
    }

    if (originalRequest.url.includes("/auth/refresh")) {
      window.location.href = "https://aidsense.online/auth/google"
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh(() => {
          resolve(apiClient(originalRequest))
        })
      })
    }

    isRefreshing = true

    try {
      await apiClient.post("/auth/refresh")

      isRefreshing = false
      onRefreshed()

      return apiClient(originalRequest)
    } catch (err) {
      isRefreshing = false
      window.location.href = "https://aidsense.online/auth/google"
      return Promise.reject(err)
    }
  }
)