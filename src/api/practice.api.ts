import { apiClient } from "./apiClient.api"
import { PracticeSubmitDTO, PracticeTestDTO, PracticeTestPreview } from "@/data/practices/practice.types"

export const practiceApi = {
  getPracticeTests: () =>
    apiClient.get<PracticeTestPreview[]>("/practice/tests"),

  getSkills: () =>
    apiClient.get<{ data: any[] }>("/practice/skills"),

  getSkillPreview: (id: string) =>
    apiClient.get<PracticeTestDTO>(`/practice/skills/${id}/preview`),

  getTestPreview: (id: string) =>
    apiClient.get<PracticeTestDTO>(`/practice/tests/${id}/preview`),

  startSkillAttempt: (testId: string, skillType: string) =>
    apiClient.post(`/practice/tests/${testId}/skills/${skillType.toLowerCase()}/start`),

  submitSkillAnswers: (testId: string, skillType: string, data: PracticeSubmitDTO) =>
    apiClient.post(`/practice/tests/${testId}/skills/${skillType.toLowerCase()}/submit`, data)
}