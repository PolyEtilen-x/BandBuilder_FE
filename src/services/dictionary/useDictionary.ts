import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getDictionary, DictionaryResult } from "@/api/dictionary.api"
import { useVocabStore } from "./vocab.store"

export interface UseDictionaryReturn {
  dict: DictionaryResult | null
  loading: boolean
  lookup: (word: string, sentence?: string) => void
  close: () => void
  save: () => void
  remove: (word: string) => void
}

/**
 * Hook to lookup dictionary definitions (Server State via TanStack Query)
 * and manage saved words list (Client State via Zustand store).
 */
export function useDictionary(): UseDictionaryReturn {
  const [searchParams, setSearchParams] = useState<{ word: string; sentence?: string } | null>(null)

  const { addWord, removeWord, savedWords } = useVocabStore()

  // Use TanStack Query to manage and cache server-side dictionary queries
  const { data, isFetching } = useQuery<DictionaryResult>({
    queryKey: ["dictionary", searchParams?.word, searchParams?.sentence],
    queryFn: () => {
      if (!searchParams?.word) throw new Error("No word provided")
      return getDictionary(searchParams.word, searchParams.sentence)
    },
    enabled: !!searchParams?.word,
    staleTime: 5 * 60 * 1000, // Cache dictionary responses for 5 minutes
  })

  const lookup = (word: string, sentence?: string): void => {
    const cleanWord = word.toLowerCase().trim().split(" ")[0]
    setSearchParams({ word: cleanWord, sentence })
  }

  const close = (): void => {
    setSearchParams(null)
  }

  const save = (): void => {
    if (!data) return
    addWord(data)
  }

  const remove = (word: string): void => {
    removeWord(word)
  }

  // Derive saved state reactively from Zustand client state
  const isSaved = data
    ? savedWords.some((w) => w.word.toLowerCase() === data.word.toLowerCase())
    : false

  const dict: DictionaryResult | null = data
    ? {
        ...data,
        isSaved,
      }
    : null

  return {
    dict,
    loading: isFetching,
    lookup,
    close,
    save,
    remove,
  }
}
