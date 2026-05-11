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
let refreshPromise: Promise<any> | null = null

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    if (!error.response) throw error

    const status = error.response.status

    if (status !== 401) throw error

    if (originalRequest.url.includes("/auth/refresh")) {
      // Nếu chính request refresh bị lỗi 401, chỉ cần báo lỗi, không redirect
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
      // Khi refresh thất bại hoàn toàn, cũng không redirect ở đây
      throw err
    }
  }
)