import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const createSupervisor = catchAsync(async (req, res) => {
    const result = await UserServices.createSupervisor(req.body);
    sendResponse(res, {
        statusCode: status.CREATED,
        message: 'Supervisor created successfully',
        data: result,
    });
});

const getMe = catchAsync(async (req, res) => {
    const result = await UserServices.getMe(req.user);
    sendResponse(res, {
        statusCode: status.OK,
        message: 'User retrieved successfully',
        data: result,
    });
});

export const UserControllers = {
    createSupervisor,
    getMe,
};
