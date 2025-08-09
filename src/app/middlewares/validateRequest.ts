import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { ZodObject } from 'zod';

const validateRequest = (schema: ZodObject) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            req.body = await schema.parseAsync(req.body);
            next();
        },
    );
};

export default validateRequest;
