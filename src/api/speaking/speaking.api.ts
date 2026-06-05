import { apiClient } from "../apiClient.api"

export type DialogueTurn = {
  sender: "ai" | "user"
  text: string
}

export type CorrectionItem = {
  type: "grammar" | "vocab" | "positive"
  original?: string
  correction?: string
  explanation: string
}

export type SpeakingSessionData = {
  voiceId: string
  dialogue: DialogueTurn[]
  overallBand: number
  fluency: number
  lexical: number
  grammar: number
  pronunciation: number
  corrections: CorrectionItem[]
}

export type SpeakingSessionResponse = SpeakingSessionData & {
  id: string
  userId: string
  createdAt: string
}

export const speakingApi = {
  async saveSession(data: SpeakingSessionData): Promise<SpeakingSessionResponse> {
    const res = await apiClient.post("/speaking/sessions", data)
    return res.data
  },

  async getHistory(): Promise<SpeakingSessionResponse[]> {
    const res = await apiClient.get("/speaking/sessions")
    return res.data
  },

  async getSessionDetail(id: string): Promise<SpeakingSessionResponse> {
    const res = await apiClient.get(`/speaking/sessions/${id}`)
    return res.data
  }
}
