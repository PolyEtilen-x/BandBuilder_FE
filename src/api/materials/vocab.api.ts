import { apiClient } from "../apiClient.api"
import { VocabTopic, VocabItem } from "@/data/vocab/vocab.model"
import { useVocabStore } from "@/services/dictionary/vocab.store"

// Helper to get/set saved word IDs per topic in localStorage
const getTopicSavedWords = (): Record<string, string[]> => {
  try {
    return JSON.parse(localStorage.getItem("topic_saved_words") || "{}")
  } catch {
    return {}
  }
}

const saveTopicSavedWords = (data: Record<string, string[]>) => {
  localStorage.setItem("topic_saved_words", JSON.stringify(data))
}

export const vocabApi = {
  async getTopics(): Promise<VocabTopic[]> {
    const res = await apiClient.get<any[]>("/materials/vocab/topics")
    const topicSavedWords = getTopicSavedWords()

    return res.data.map((t) => {
      const savedIds = topicSavedWords[t.name] || []
      return {
        id: t.id, // Keep the backend ID
        topic: t.name,
        numberSaved: savedIds.length,
        vocab_list: [] // The list page only needs the topic name and counts
      }
    })
  },

  async getTopic(name: string): Promise<VocabTopic | undefined> {
    // 1. Get all topics to find the backend ID corresponding to the name
    const topics = await this.getTopics()
    const foundTopic = topics.find((t) => t.topic === name)
    if (!foundTopic) return undefined

    // 2. Fetch the detailed topic from backend using ID
    const res = await apiClient.get<any>(`/materials/vocab/topics/${foundTopic.id!}`)
    const data = res.data

    const topicSavedWords = getTopicSavedWords()
    const savedIds = topicSavedWords[name] || []

    // 3. Map backend words to VocabItem shape
    const vocab_list: VocabItem[] = data.words.map((w: any) => ({
      id: w.id,
      word: w.word,
      meaning: w.meaning,
      pronunciation: w.pronunciation || "",
      example: w.example || "",
      synonyms: w.synonyms || [],
      isSaved: savedIds.includes(w.id)
    }))

    // Clean up savedIds in case some words were deleted by admin in the backend
    const validSavedIds = savedIds.filter(id => data.words.some((w: any) => w.id === id))
    if (validSavedIds.length !== savedIds.length) {
      topicSavedWords[name] = validSavedIds
      saveTopicSavedWords(topicSavedWords)
    }

    return {
      topic: data.name,
      numberSaved: validSavedIds.length,
      vocab_list
    }
  },

  async toggleSave(topicName: string, wordId: string): Promise<VocabTopic | undefined> {
    // 1. Load current saved words map
    const topicSavedWords = getTopicSavedWords()
    const savedIds = topicSavedWords[topicName] || []

    // 2. Fetch the detailed topic first to get the word details (needed for Zustand store)
    const topicDetail = await this.getTopic(topicName)
    if (!topicDetail) return undefined

    const word = topicDetail.vocab_list.find((w) => w.id === wordId)
    if (!word) return topicDetail

    const store = useVocabStore.getState()
    const index = savedIds.indexOf(wordId)

    if (index > -1) {
      // Unsave
      savedIds.splice(index, 1)
      store.removeWord(word.word)
    } else {
      // Save
      savedIds.push(wordId)
      store.addWord({
        word: word.word,
        phonetic: word.pronunciation || "",
        audio: "",
        meaning: word.meaning,
        related: word.synonyms ? word.synonyms.join(", ") : "",
        explainVN: word.meaning,
        example: word.example || "",
        translation: "",
        isSaved: true,
        dateSaved: new Date().toISOString()
      })
    }

    topicSavedWords[topicName] = savedIds
    saveTopicSavedWords(topicSavedWords)

    // 3. Return the updated topic detail
    return this.getTopic(topicName)
  },

  // ─── Admin CRUD APIs ──────────────────────────────────────────────────────────

  async createTopic(dto: { name: string; type: "TOPIC" | "BAND_LR" | "BAND_SW"; bandLevel?: number }): Promise<any> {
    const res = await apiClient.post("/admin/materials/vocab/topics", dto)
    return res.data
  },

  async updateTopic(id: string, dto: { name?: string; type?: "TOPIC" | "BAND_LR" | "BAND_SW"; bandLevel?: number }): Promise<any> {
    const res = await apiClient.patch(`/admin/materials/vocab/topics/${id}`, dto)
    return res.data
  },

  async deleteTopic(id: string): Promise<any> {
    const res = await apiClient.delete(`/admin/materials/vocab/topics/${id}`)
    return res.data
  },

  async createWord(topicId: string, dto: { word: string; meaning: string; pronunciation?: string; example?: string; synonyms?: string[] }): Promise<any> {
    const res = await apiClient.post(`/admin/materials/vocab/topics/${topicId}/words`, dto)
    return res.data
  },

  async updateWord(id: string, dto: { word?: string; meaning?: string; pronunciation?: string; example?: string; synonyms?: string[] }): Promise<any> {
    const res = await apiClient.patch(`/admin/materials/vocab/words/${id}`, dto)
    return res.data
  },

  async deleteWord(id: string): Promise<any> {
    const res = await apiClient.delete(`/admin/materials/vocab/words/${id}`)
    return res.data
  }
}