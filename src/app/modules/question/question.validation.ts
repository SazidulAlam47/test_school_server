import z from 'zod';
import { CorrectAnswers, QuestionLevels } from './question.constant';

const createQuestion = z.object({
    text: z.string(),
    options: z.string().array(),
    correctAnswer: z.union(CorrectAnswers.map((value) => z.literal(value))),
    level: z.enum(QuestionLevels),
});

export const QuestionValidations = {
    createQuestion,
};
