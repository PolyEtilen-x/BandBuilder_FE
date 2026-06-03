export type VocabItem = {
  id: string
  word: string
  meaning: string
  pronunciation?: string
  example?: string
  synonyms?: string[]
  isSaved: boolean
}

export type VocabTopic = {
  id?: string
  topic: string
  numberSaved: number
  vocab_list: VocabItem[]
}