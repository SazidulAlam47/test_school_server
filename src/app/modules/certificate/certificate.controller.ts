import { Request, Response } from 'express';
import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CertificateServices } from './certificate.service';

const getUserCertificate = catchAsync(async (req: Request, res: Response) => {
    const result = await CertificateServices.getUserCertificate(req.user);

    sendResponse(res, {
        statusCode: status.OK,
        message: 'Certificate has sent to your email',
        data: result,
    });
});

const getAllCertificates = catchAsync(async (req: Request, res: Response) => {
    const result = await CertificateServices.getAllCertificates();

    sendResponse(res, {
        statusCode: status.OK,
        message: 'All Certificates retrieved successfully',
        data: result,
    });
});

export const CertificateControllers = {
    getUserCertificate,
    getAllCertificates,
};
