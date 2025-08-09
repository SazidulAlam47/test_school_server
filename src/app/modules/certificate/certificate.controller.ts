import { Request, Response } from 'express';
import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CertificateServices } from './certificate.service';

const getUserCertificate = catchAsync(async (req: Request, res: Response) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result = await CertificateServices.getUserCertificate(
        req.user,
        baseUrl,
    );

    sendResponse(res, {
        statusCode: status.OK,
        message: 'Certificate retrieved successfully',
        data: result,
    });
});

const getAllCertificates = catchAsync(async (req: Request, res: Response) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result = await CertificateServices.getAllCertificates(baseUrl);

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
