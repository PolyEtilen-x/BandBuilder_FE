import { apiClient } from "@/api/apiClient.api"

export async function getCurrentUser() {
  try {
    const res = await apiClient.get("/auth/me")
    return res.data
  } catch (err) {
    return null
  }
}

export async function refreshToken() {
  try {
    await apiClient.post("/auth/refresh")
    return true
  } catch {
    return false
  }
}