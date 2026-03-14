export type Exercise = {
  title: string
  id: string
  questions: number
  participants: number
  progress: number
}

export type PracticeSectionType = {
  name_practice: string
  total: number
  exercises: Exercise[]
}

export type SkillPractice = {
  skill: string
  sections: PracticeSectionType[]
}