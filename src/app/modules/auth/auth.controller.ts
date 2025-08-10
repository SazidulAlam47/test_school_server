import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import config from '../../config';

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
    const { refreshToken, accessToken, needPasswordChange, role } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: config.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    sendResponse(res, {
        statusCode: status.OK,
        message: 'Logged in successfully',
        data: {
            accessToken,
            needPasswordChange,
            role,
        },
    });
});

const logoutUser = catchAsync(async (req, res) => {
    res.clearCookie('refreshToken', {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: config.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    sendResponse(res, {
        statusCode: status.OK,
        message: 'Logged out successfully',
        data: null,
    });
});

const changePassword = catchAsync(async (req, res) => {
    const result = await AuthServices.changePassword(req.user, req.body);
    sendResponse(res, {
        statusCode: status.OK,
        message: 'Password is changed successfully',
        data: result,
    });
});

const refreshToken = catchAsync(async (req, res) => {
    const result = await AuthServices.refreshToken(req.cookies.refreshToken);
    sendResponse(res, {
        statusCode: status.OK,
        message: 'Access Token retrieved successfully',
        data: result,
    });
});

const forgetPassword = catchAsync(async (req, res) => {
    const { email } = req.body;
    const result = await AuthServices.forgetPassword(email);
    sendResponse(res, {
        statusCode: status.OK,
        message: 'Reset email is sent successfully',
        data: result,
    });
});

const resetPassword = catchAsync(async (req, res) => {
    const token = req.headers.authorization || '';
    const result = await AuthServices.resetPassword(token, req.body);
    sendResponse(res, {
        statusCode: status.OK,
        message: 'Password reset successful',
        data: result,
    });
});

export const AuthControllers = {
    registerStudent,
    verifyEmail,
    login,
    logoutUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
