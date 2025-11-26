export type Session = {
  sessionId: string;
  description: string;
  createdAt: string;
  tests: Test[];
};

export type Test = {
  testId: number;
  sessionId: string;
  topic: string;
  questionCount: number;
  createdAt: string;
  questions: Question[];
};

export type Question = {
  id: number;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
};

export type AnswerOption = 'optionA' | 'optionB' | 'optionC' | 'optionD';
