export async function getDictionary(word: string, sentence?: string) {
  const cleanWord = word.toLowerCase().trim().split(" ")[0]

  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`
    )

    const translateRes = await fetch(
      `https://api.mymemory.translated.net/get?q=${sentence}&langpair=en|vi`
    )

    const translateData = await translateRes.json()

    const translation =
      translateData?.responseData?.translatedText || ""
    
      if (!res.ok) throw new Error("Not found")

    const data = await res.json()

    if (!Array.isArray(data)) throw new Error("Invalid response")
      
    const entry = data[0]

    return {
      word: cleanWord,
      phonetic: entry?.phonetic || "",
      audio: entry?.phonetics?.find((p: any) => p.audio)?.audio,
      meaning: entry?.meanings?.[0]?.definitions?.[0]?.definition,

      related: `${cleanWord} something`,

      explainVN: `Trong đoạn văn, "${cleanWord}" được dùng để diễn đạt mục đích hoặc ý nghĩa liên quan.`,

      example: `This gift is for you.\nWe decided to go for a walk.`,

      translation: translation || "",
    }
  } catch {
    return {
      word,
      phonetic: "",
      audio: "",
      meaning: "Không tìm thấy",

      related: "",
      explainVN: "",
      example: "",
      translation: "",
    }
  }
}