import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { QuestionServices } from './question.service';

const createQuestion = catchAsync(async (req, res) => {
    const result = await QuestionServices.createQuestion(req.body);
    sendResponse(res, {
        statusCode: status.CREATED,
        message: 'Supervisor created successfully',
        data: result,
    });
});

export const QuestionControllers = {
    createQuestion,
};
