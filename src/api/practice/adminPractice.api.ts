import { apiClient } from "../apiClient.api"

export interface AdminPracticeTestListItem {
  id: string
  title: string
  skills: {
    skillTestId: string
    skillContentId: string
    skillType: string // "listening" | "reading" | "writing" | "speaking"
  }[]
}

export interface AdminPracticeTestDetail {
  id: string
  title: string
  skills: {
    skillTestId: string
    skillContentId: string
    skillType: string
    skillTypeId: number
    audioUrl: string | null
    source: string
    createdAt: string
    contentJson: any
  }[]
}

export const adminPracticeApi = {
  // Get all tests (paginated)
  getAllTests: (page: number = 1, limit: number = 50) =>
    apiClient.get<{ data: AdminPracticeTestListItem[]; meta: any }>(
      "/admin/practice/tests",
      { params: { page, limit } }
    ),

  // Get test details (including all skill contents and JSONs)
  getTestById: (id: string) =>
    apiClient.get<AdminPracticeTestDetail>(`/admin/practice/tests/${id}`),

  // Create a new practice test
  createTest: (title: string) =>
    apiClient.post<any>("/admin/practice/tests", { title }),

  // Update test title
  updateTest: (id: string, title: string) =>
    apiClient.put<any>(`/admin/practice/tests/${id}`, { title }),

  // Delete a practice test
  deleteTest: (id: string) =>
    apiClient.delete<any>(`/admin/practice/tests/${id}`),

  // Add a skill to a test
  addSkillToTest: (
    testId: string,
    dto: {
      skillTypeId: number
      contentJson: any
      audioUrl?: string
      source: string
    }
  ) => apiClient.post<any>(`/admin/practice/tests/${testId}/skills`, dto),

  // Update a skill's content/JSON/audio/source
  updateSkill: (
    skillContentId: string,
    dto: {
      contentJson?: any
      audioUrl?: string
      source?: string
    }
  ) => apiClient.put<any>(`/admin/practice/skills/${skillContentId}`, dto),

  // Delete a skill from a test
  deleteSkillFromTest: (practiceTestId: string, skillTestId: string) =>
    apiClient.delete<any>(
      `/admin/practice/tests/${practiceTestId}/skills/${skillTestId}`
    ),
}
