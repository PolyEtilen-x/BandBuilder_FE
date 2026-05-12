import { apiClient } from "./apiClient.api"
import { PracticeTestDTO, PracticeTestPreview } from "@/types/practice.types"

export const practiceApi = {
  getPracticeTests: () =>
    apiClient.get<PracticeTestPreview[]>("/practice/tests"),

  getSkills: () =>
    apiClient.get<{ data: any[] }>("/practice/skills"),

  getSkillPreview: (id: string) =>
    apiClient.get<PracticeTestDTO>(`/practice/skills/${id}/preview`),

  getTestPreview: (id: string) =>
    apiClient.get<PracticeTestDTO>(`/practice/tests/${id}/preview`)
}