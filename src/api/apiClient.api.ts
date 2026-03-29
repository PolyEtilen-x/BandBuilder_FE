import axios from "axios"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        await apiClient.post("/auth/refresh")

        return apiClient(originalRequest)
      } catch (err) {
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)