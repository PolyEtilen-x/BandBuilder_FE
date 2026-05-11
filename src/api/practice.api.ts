import axios from "axios"
import { apiClient } from "./apiClient.api"

export const practiceApi = {
  getPracticeTests: () =>
    apiClient.get("/practice/tests"),

  getSkills: () => {
    console.log(import.meta.env.VITE_API_URL)
    return apiClient.get("/practice/skills")
  },

  getSkillPreview: (id: string) =>
    apiClient.get(`/practice/skills/${id}/preview`),

  getTestPreview: (id: string) =>
    apiClient.get(`/practice/tests/${id}/preview`)
}