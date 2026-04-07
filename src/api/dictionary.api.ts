export async function getDictionary(word: string) {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    )
    const data = await res.json()

    const entry = data[0]

    return {
      phonetic: entry?.phonetic,
      audio: entry?.phonetics?.find((p: any) => p.audio)?.audio,
      meaning: entry?.meanings?.[0]?.definitions?.[0]?.definition,
      example: entry?.meanings?.[0]?.definitions?.[0]?.example
    }
  } catch {
    return null
  }
}