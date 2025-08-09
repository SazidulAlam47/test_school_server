import z from 'zod';
import { Levels } from './question.constant';

const createQuestion = z.object({
    text: z.string(),
    options: z.string().array(),
    correctAnswer: z.number().min(0).max(3),
    level: z.enum(Levels),
});

export const QuestionValidations = {
    createQuestion,
};
