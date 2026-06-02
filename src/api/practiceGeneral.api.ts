import { apiClient } from "./apiClient.api"

// ── DTO types (raw API shape) ──────────────────────────────────────────────

export interface PronunciationVocabDto {
  id: string
  word: string
  ipa: string
  meaning: string
  audioUrl: string | null
  example: string
  exampleTranslation: string
}

export interface PronunciationTopicListItemDto {
  id: string
  title: string
  paragraph: string
  videoUrl: string | null
  vocabCount: number
  sentencesCount: number
}

export interface PronunciationSentenceDto {
  id: string
  topicId: string
  text: string
  startTime: number
  endTime: number
  orderIndex: number
}

export interface PronunciationTopicDetailDto {
  id: string
  title: string
  paragraph: string
  videoUrl: string | null
  audioUrl: string | null
  vocabs: PronunciationVocabDto[]
  sentences: PronunciationSentenceDto[]
}

export type WritingTaskType = "TASK_1" | "TASK_2"

export interface KeyVocabularyItem {
  phrase: string
  meaning: string
  context: string
}

export interface EssayAnalysis {
  taskAchievement?: number
  coherenceCohesion?: number
  lexicalResource?: number
  grammaticalRange?: number
  strengths?: string[]
  improvements?: string[]
  overallComment?: string
  keyVocabulary?: KeyVocabularyItem[]
}


export interface WritingSampleTopicListItemDto {
  id: string
  taskType: WritingTaskType
  category: string
  prompt: string
  imageUrl: string | null
  essayCount: number
}

export interface WritingEssayDto {
  id: string
  bandScore: number
  essayText: string
  essayTranslation: string
  analysis: EssayAnalysis | null
}

export interface WritingSampleTopicDetailDto {
  id: string
  taskType: WritingTaskType
  category: string
  prompt: string
  imageUrl: string | null
  essays: WritingEssayDto[]
}

// ── Pronunciation API ──────────────────────────────────────────────────────

/**
 * Fetch the list of all pronunciation topics.
 */
export async function getPronunciationTopics(): Promise<PronunciationTopicListItemDto[]> {
  const res = await apiClient.get<PronunciationTopicListItemDto[]>(
    "/practice-general/pronunciation/topics"
  )
  return res.data
}

/**
 * Fetch full detail (paragraph + vocab list) for a single pronunciation topic.
 */
export async function getPronunciationTopicDetail(
  id: string
): Promise<PronunciationTopicDetailDto> {
  const res = await apiClient.get<PronunciationTopicDetailDto>(
    `/practice-general/pronunciation/topics/${id}`
  )
  return res.data
}

// ── Writing Samples API ────────────────────────────────────────────────────

/**
 * Fetch the list of all writing sample topics, optionally filtered by task type.
 */
export async function getWritingSampleTopics(
  taskType?: WritingTaskType
): Promise<WritingSampleTopicListItemDto[]> {
  const res = await apiClient.get<WritingSampleTopicListItemDto[]>(
    "/practice-general/writing-samples/topics",
    { params: taskType ? { taskType } : undefined }
  )
  return res.data
}

/**
 * Fetch full detail (all band essays) for a single writing sample topic.
 */
export async function getWritingSampleTopicDetail(
  id: string
): Promise<WritingSampleTopicDetailDto> {
  const res = await apiClient.get<WritingSampleTopicDetailDto>(
    `/practice-general/writing-samples/topics/${id}`
  )
  return res.data
}

// ── Admin Pronunciation CRUD API ───────────────────────────────────────────

/**
 * Create a new pronunciation topic (admin).
 */
export async function createPronunciationTopicAdmin(
  dto: {
    title: string
    paragraph: string
    videoUrl?: string
    audioUrl?: string
    vocabs?: any[]
    sentences?: any[]
  }
): Promise<PronunciationTopicDetailDto> {
  const res = await apiClient.post<PronunciationTopicDetailDto>(
    "/admin/pronunciation/topics",
    dto
  )
  return res.data
}

/**
 * Delete a pronunciation topic (admin).
 */
export async function deletePronunciationTopicAdmin(
  id: string
): Promise<{ success: boolean; message: string }> {
  const res = await apiClient.delete<{ success: boolean; message: string }>(
    `/admin/pronunciation/topics/${id}`
  )
  return res.data
}

// ── Admin Writing Samples CRUD API ─────────────────────────────────────────

export interface CreateWritingSampleTopicDto {
  taskType: "TASK_1" | "TASK_2"
  category: string
  prompt: string
  imageUrl?: string
}

export interface CreateWritingSampleEssayDto {
  bandScore: number
  essayText: string
  essayTranslation: string
  analysis?: any
}

export async function createWritingSampleTopicAdmin(
  dto: CreateWritingSampleTopicDto
): Promise<any> {
  const res = await apiClient.post("/admin/writing-samples/topics", dto)
  return res.data
}

export async function updateWritingSampleTopicAdmin(
  id: string,
  dto: Partial<CreateWritingSampleTopicDto>
): Promise<any> {
  const res = await apiClient.patch(`/admin/writing-samples/topics/${id}`, dto)
  return res.data
}

export async function deleteWritingSampleTopicAdmin(
  id: string
): Promise<any> {
  const res = await apiClient.delete(`/admin/writing-samples/topics/${id}`)
  return res.data
}

export async function createWritingSampleEssayAdmin(
  topicId: string,
  dto: CreateWritingSampleEssayDto
): Promise<any> {
  const res = await apiClient.post(`/admin/writing-samples/topics/${topicId}/essays`, dto)
  return res.data
}

export async function updateWritingSampleEssayAdmin(
  id: string,
  dto: Partial<CreateWritingSampleEssayDto>
): Promise<any> {
  const res = await apiClient.patch(`/admin/writing-samples/essays/${id}`, dto)
  return res.data
}

export async function deleteWritingSampleEssayAdmin(
  id: string
): Promise<any> {
  const res = await apiClient.delete(`/admin/writing-samples/essays/${id}`)
  return res.data
}

