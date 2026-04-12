import { useState } from "react"
import { getDictionary } from "../../api/dictionary.api"

export function useDictionary() {
  const [dict, setDict] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const lookup = async (word: string, sentence?: string) => {
    setLoading(true)

    const data = await getDictionary(word, sentence) 

    setDict(data)
    setLoading(false)
  }

  const close = () => setDict(null)

  const save = () => {
    if (!dict) return
    const saved = JSON.parse(localStorage.getItem("vocab") || "[]")
    localStorage.setItem("vocab", JSON.stringify([...saved, dict]))
  }

  return {
    dict,
    loading,
    lookup,
    close,
    save
  }
}