import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const registerStudent = catchAsync(async (req, res) => {
    const result = await AuthServices.registerStudent(req.body);
    sendResponse(res, {
        statusCode: status.CREATED,
        message: 'User registered successfully',
        data: result,
    });
});

const verifyEmail = catchAsync(async (req, res) => {
    const result = await AuthServices.verifyEmail(req.body);
    sendResponse(res, {
        statusCode: status.OK,
        message: 'Email verified successfully',
        data: result,
    });
});

const login = catchAsync(async (req, res) => {
    const result = await AuthServices.login(req.body);
    sendResponse(res, {
        statusCode: status.OK,
        message: 'User logged in successfully',
        data: result,
    });
});

export const AuthControllers = {
    registerStudent,
    verifyEmail,
    login,
};
