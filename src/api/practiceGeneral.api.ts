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
  vocabCount: number
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

export interface WritingSampleTopicListItemDto {
  id: string
  taskType: WritingTaskType
  category: string
  promptPreview: string
}

export interface WritingEssayDto {
  id: string
  bandScore: number
  essayText: string
  essayTranslation: string
  analysis: Record<string, unknown> | null
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
