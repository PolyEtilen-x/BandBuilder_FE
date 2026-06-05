import type { SkillContentPreview } from '@/data/practices/skillContent.model';
import type { ListeningQuestionBlock } from '@/data/practices/listening.model';
import type { ReadingQuestionBlock } from '@/data/practices/reading.model';
import type { PracticeTestDTO } from '@/data/practices/practice.types';

export interface TestUnit {
  id: number;
  title: string;
  description: string;
  questionBlocks: ReadingQuestionBlock[] | ListeningQuestionBlock[];
  type: 'reading' | 'listening' | 'writing' | 'speaking';
  audioUrl?: string;
  imgUrl?: string;
  timeSuggestedMinutes?: number;
}

export function normalizeTestUnits(test: SkillContentPreview | PracticeTestDTO): TestUnit[] {
  const content = test.content as any;

  // Reading
  if (content?.passages) {
    return content.passages.map((p: any): TestUnit => ({
      id: p.passage_number,
      title: `${p.title || 'Reading'} — Passage ${p.passage_number}`,
      description: p.topic,                    // topic is more meaningful than repeating title
      questionBlocks: p.question_blocks,
      type: 'reading',
      timeSuggestedMinutes: p.time_suggested_minutes,
    }));
  }

  // Listening
  if (content?.sections) {
    return content.sections.map((s: any): TestUnit => ({
      id: s.section,
      title: `${formatContext(s.context || 'Listening')} — Section ${s.section}`,
      description: s.description,
      questionBlocks: s.question_blocks,
      type: 'listening',
      audioUrl: s.audioUrl,
      imgUrl: s.imgUrl,
    }));
  }

  // Writing
  if (content?.task) {
    return [{
      id: content.task,
      title: `Writing Task ${content.task}`,
      description: content.prompt || '',
      questionBlocks: [],
      type: 'writing',
      timeSuggestedMinutes: content.time_minutes,
    }];
  }

  // Speaking
  if (content?.part) {
    return [{
      id: content.part,
      title: `Speaking Part ${content.part}`,
      description: content.topic || content.scenario || '',
      questionBlocks: [],
      type: 'speaking',
      timeSuggestedMinutes: content.time_minutes,
    }];
  }

  return [];
}

function formatContext(str: string): string {
  return str
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}