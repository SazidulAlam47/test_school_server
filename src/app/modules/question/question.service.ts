import status from 'http-status';
import ApiError from '../../errors/ApiError';
import { IQuestion } from './question.interface';
import { Question } from './question.model';

const createQuestion = async (payload: IQuestion) => {
    const result = await Question.create(payload);
    return result;
};

const getAllQuestions = async () => {
    const result = await Question.find();
    return result;
};

const getAllQuestionsByStep = async (step: number) => {
    const filter: Record<string, unknown> = {};
    if (step === 1) {
        filter.level = { $in: ['A1', 'A2'] };
    } else if (step === 2) {
        filter.level = { $in: ['B1', 'B2'] };
    } else if (step === 3) {
        filter.level = { $in: ['C1', 'C2'] };
    }
    const result = await Question.aggregate([
        { $match: filter },
        { $sample: { size: 44 } },
        { $project: { correctAnswer: 0 } },
    ]);
    return result;
};

const getQuestionById = async (id: string) => {
    const result = await Question.findById(id);
    if (!result) {
        throw new ApiError(status.NOT_FOUND, 'Question not found');
    }
    return result;
};

export const QuestionServices = {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    getAllQuestionsByStep,
};
