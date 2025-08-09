import { CorrectAnswers, Levels } from './question.constant';

export type TLevel = (typeof Levels)[number];
export type TCorrectAnswer = (typeof CorrectAnswers)[number];

export interface IQuestion {
    text: string;
    options: string[];
    correctAnswer: TCorrectAnswer;
    level: TLevel;
}
