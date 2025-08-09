import { IQuestion } from './question.interface';
import { Question } from './question.model';

const createQuestion = async (payload: IQuestion) => {
    const result = await Question.create(payload);
    return result;
};

export const QuestionServices = {
    createQuestion,
};
