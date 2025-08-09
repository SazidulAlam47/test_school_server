import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { QuestionServices } from './question.service';

const createQuestion = catchAsync(async (req, res) => {
    const result = await QuestionServices.createQuestion(req.body);
    sendResponse(res, {
        statusCode: status.CREATED,
        message: 'Question created successfully',
        data: result,
    });
});

const getAllQuestions = catchAsync(async (req, res) => {
    const result = await QuestionServices.getAllQuestions();
    sendResponse(res, {
        statusCode: status.OK,
        message: 'All Questions fetched successfully',
        data: result,
    });
});

const getAllQuestionsByStep = catchAsync(async (req, res) => {
    const step = Number(req.params.step);
    const result = await QuestionServices.getAllQuestionsByStep(step);
    sendResponse(res, {
        statusCode: status.OK,
        message: 'All Questions fetched successfully',
        data: result,
    });
});

const getQuestionById = catchAsync(async (req, res) => {
    const result = await QuestionServices.getQuestionById(req.params.id);
    sendResponse(res, {
        statusCode: status.OK,
        message: 'Question fetched successfully',
        data: result,
    });
});

export const QuestionControllers = {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    getAllQuestionsByStep,
};
