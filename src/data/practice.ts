export type Exercise = {
  name: string
  questions: number
  participants: number
  progress: number
}

export type PracticeSection = {
  name_practice: string
  total: number
  exercises: Exercise[]
}

export type SkillPractice = {
  skill: "Reading" | "Listening" | "Writing" | "Speaking" | "All Skills"
  sections: PracticeSection[]
}