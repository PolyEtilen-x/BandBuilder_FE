import { create } from "zustand"
import { DictionaryResult } from "@/api/dictionary.api"

export interface VocabState {
  savedWords: DictionaryResult[]
  addWord: (word: DictionaryResult) => void
  removeWord: (word: string) => void
}

// Load words from localStorage instantly on store initialization
const loadInitialWords = (): DictionaryResult[] => {
  try {
    return JSON.parse(localStorage.getItem("vocab") || "[]")
  } catch (error) {
    console.error("Failed to parse saved vocabulary from localStorage:", error)
    return []
  }
}

export const useVocabStore = create<VocabState>((set, get) => ({
  savedWords: loadInitialWords(),

  addWord: (word: DictionaryResult): void => {
    const { savedWords } = get()
    // Prevent duplicate entries (case-insensitive check)
    const isAlreadySaved = savedWords.some(
      (item) => item.word.toLowerCase() === word.word.toLowerCase()
    )
    if (isAlreadySaved) return

    const newWord: DictionaryResult = {
      ...word,
      isSaved: true,
      dateSaved: word.dateSaved || new Date().toISOString(),
    }

    const updated = [...savedWords, newWord]
    set({ savedWords: updated })
    localStorage.setItem("vocab", JSON.stringify(updated))
  },

  removeWord: (wordStr: string): void => {
    const { savedWords } = get()
    const updated = savedWords.filter(
      (item) => item.word.toLowerCase() !== wordStr.toLowerCase()
    )
    set({ savedWords: updated })
    localStorage.setItem("vocab", JSON.stringify(updated))
  },
}))
