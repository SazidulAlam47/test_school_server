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

export const TestAttemptControllers = {
    startTest,
};
