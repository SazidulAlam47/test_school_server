import { CorrectAnswers, QuestionLevels } from './question.constant';

export type TQuestionLevel = (typeof QuestionLevels)[number];
export type TCorrectAnswer = (typeof CorrectAnswers)[number];

export interface IQuestion {
    text: string;
    options: string[];
    correctAnswer: TCorrectAnswer;
    level: TQuestionLevel;
}
