export type Session = {
  sessionId: string;
  description: string;
  createdAt: string;
  tests: Test[];
  algorithmTasks: AlgorithmTask[];
};

export type AlgorithmTask = {
  taskId: string;
  titleRu: string;
  descriptionRu: string;
  difficulty: string;
  assignedAt: string;
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

export type Topic = {
  name: string;
  displayName: string;
  description: string;
};

export type CandidateType = {
  id: string;
  candidateName: string;
  accessToken: string;
  accessUrl: string;
  createdAt: string;
};

export type CandidateResult = {
  id: string;
  candidateId: string;
  candidateName: string;
  testResults: string;
  algorithmResults: string;
  violationDetected: boolean;
  submittedAt: string;
};

export type AnswerOption = 'optionA' | 'optionB' | 'optionC' | 'optionD';
