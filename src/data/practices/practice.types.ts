export type IELTSComponentType = 'Reading' | 'Listening' | 'Writing' | 'Speaking';

export interface Question {
  id: string;
  question_number?: number;
  text?: string;
  options?: string[];
  content?: string; // For some specific types
}

export interface QuestionBlock {
  id: string;
  instruction: string;
  question_type: string;
  questions_range: string;
  questions?: Question[];
  guide?: string;
  content?: string;
}

export interface Passage {
  id: string;
  passage_number: number;
  title: string;
  content: string;
  question_blocks: QuestionBlock[];
  time_suggested_minutes?: number;
}

export interface Section {
  id: string;
  section: number;
  title: string;
  audio_url: string;
  question_blocks: QuestionBlock[];
  time_suggested_minutes?: number;
}

export interface WritingVisual {
  type: string;
  label: string;
  data_points?: any[];
}

export interface WritingTask {
  task: 1 | 2;
  module?: string;
  prompt: string;
  instruction: string;
  min_words: number;
  time_minutes: number;
  // Task 1 specific
  visual_type?: string;
  visual_description?: string;
  visuals?: WritingVisual[];
  // Task 2 specific
  essay_type?: string;
  note?: string;
}

export interface TestContent {
  passages?: Passage[];
  sections?: Section[];
  // Writing: content IS the task object (flat)
  task?: 1 | 2;
  prompt?: string;
  instruction?: string;
  min_words?: number;
  time_minutes?: number;
}

export interface PracticeTestDTO {
  skillContentId: string;
  skillType: IELTSComponentType;
  audioUrl: string | null;
  source: string;
  createdAt: string;
  content: TestContent;
  // Aliases for compatibility
  id: string;
  skill: IELTSComponentType;
  // Writing: filled by usePracticeTest hook
  taskNumber?: 1 | 2;
  skills?: any[];
}

export interface PracticeTestPreview {
  id: string;
  title: string;
  skill: IELTSComponentType;
  thumbnail?: string;
}

export interface AnswerSubmission {
  questionId: string;
  userAnswer: string;
}

export interface PracticeSubmitDTO {
  answers: AnswerSubmission[];
  timeSpentSec: number;
}
