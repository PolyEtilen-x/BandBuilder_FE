export type LearningType = "general" | "ielts"

export interface RoadmapNode {
  id: string
  title: string
  description: string
  estimatedTime: string
  focus: string[]
  skills: string[]
  resources: string[]
}

export interface Roadmap {
  id: string
  title: string
  description: string
  type: LearningType
  currentLevel: string
  targetLevel: string
  estimatedDuration: string
  nodes: RoadmapNode[]
}

export interface GenerateRoadmapPayload {
  learningType: LearningType
  currentLevel: string
  targetLevel: string
  speaking: string
  reading: string
  listening: string
  writing: string
}
