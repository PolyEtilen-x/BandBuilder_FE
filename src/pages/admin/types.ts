// src/pages/admin/types.ts

export interface Transaction {
  id: string
  sePayTxId: string
  email: string
  amount: number
  credits: number
  status: "COMPLETED" | "PENDING" | "FAILED"
  date: string
  memo: string
}

export interface Question {
  id: string
  type: "multiple-choice" | "fill-in-the-blank" | "matching"
  text: string
  options?: string[]
  correctAnswer: string
}

export interface PracticeTest {
  id: string
  title: string
  visits: number
  skills: string[]
  contentJson: string // stringified questions or JSON config
}

export interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  bonus: number
  isActive: boolean
  sortOrder: number
}

export interface ShadowingSentence {
  id: string
  text: string
  startTime: number
  endTime: number
  orderIndex: number
}

export interface ShadowingTopic {
  id: string
  title: string
  videoUrl: string
  audioUrl?: string
  vocabCount: number
  sentencesCount: number
  paragraph: string
  sentences: ShadowingSentence[]
}

export interface UserAdmin {
  id: string
  name: string
  email: string
  role: "STUDENT" | "ADMIN"
  balance: number
  joinDate: string
}
