export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type QuestionPaperQuestion = {
  id: string;
  text: string;
  difficulty: QuestionDifficulty;
  marks: number;
};

export type QuestionPaperSection = {
  id: string;
  title: string;
  instruction: string;
  questionTypeLabel: string;
  questions: QuestionPaperQuestion[];
};

export type QuestionPaperViewModel = {
  schoolName: string;
  subject: string;
  className: string;
  durationText: string;
  maxMarks: number;
  sections: QuestionPaperSection[];
};
