import { apiClient } from "./apiClient.api"

export interface DictionaryResult {
  word: string
  phonetic: string
  audio: string
  meaning: string
  related: string
  explainVN: string
  example: string
  translation: string
  isSaved: boolean
  dateSaved: string | null
  exampleTranslation?: string
}

export async function getDictionary(word: string, sentence?: string): Promise<DictionaryResult> {
  const cleanWord = word.toLowerCase().trim().split(" ")[0]

  try {
    const res = await apiClient.get<DictionaryResult>("/dictionary", {
      params: { word: cleanWord, sentence }
    })
    return res.data
  } catch (error) {
    console.error("Dictionary API error:", error)
    return {
      word,
      phonetic: "",
      audio: "",
      meaning: "Definition not found",
      related: "N/A",
      explainVN: "Không tìm thấy nghĩa",
      example: "N/A",
      translation: "",
      isSaved: false,
      dateSaved: null
    }
  }
}