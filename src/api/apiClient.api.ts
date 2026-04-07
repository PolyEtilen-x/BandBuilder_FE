import axios from "axios"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true
})


let isRefreshing = false
let refreshSubscribers: ((token?: any) => void)[] = []

function subscribeTokenRefresh(cb: (token?: any) => void) {
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

    //  401 = reject
    if (error.response?.status !== 401) {
      return Promise.reject(error)
    }

    // if request is refresh but response 401 → logout
    if (originalRequest.url.includes("/auth/refresh")) {
      window.location.href = "/login"
      return Promise.reject(error)
    }

    // loop
    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    // if refreshing = wait for refresh to finish, then retry original request
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
      window.location.href = "/login"
      return Promise.reject(err)
    }
  }
)