export type QuestionType = "fill_blank" | "mcq" | "true_false"

export type Question = {
  id: number
  type: QuestionType
  text: string
  options?: string[]
}

export type QuestionGroup = {
  label: string
  start: number
  end: number
}

export type PracticeTest = {
  id: string
  passage: string
  questionGroups: QuestionGroup[]
  questions: Question[]
}