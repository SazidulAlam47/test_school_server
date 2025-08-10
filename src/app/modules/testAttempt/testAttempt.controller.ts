import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TestAttemptServices } from './testAttempt.service';

const startTest = catchAsync(async (req, res) => {
    const result = await TestAttemptServices.startTest(req.user);
    sendResponse(res, {
        statusCode: status.CREATED,
        message: 'Test started successfully',
        data: result,
    });
});

const submitAnswers = catchAsync(async (req, res) => {
    const result = await TestAttemptServices.submitAnswers(
        req.params.id,
        req.body,
    );
    sendResponse(res, {
        statusCode: status.OK,
        message: 'Answers submitted successfully',
        data: result,
    });
});

const getMyAttempts = catchAsync(async (req, res) => {
    const result = await TestAttemptServices.getMyAttempts(req.user);
    sendResponse(res, {
        statusCode: status.OK,
        message: 'My test attempts retrieved successfully',
        data: result,
    });
});

export const TestAttemptControllers = {
    startTest,
    submitAnswers,
    getMyAttempts,
};
