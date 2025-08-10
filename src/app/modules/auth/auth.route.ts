import express from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidations } from './auth.validation';

const router = express.Router();

router.post(
    '/register',
    validateRequest(AuthValidations.registerStudent),
    AuthControllers.registerStudent,
);
router.post(
    '/verify-email',
    validateRequest(AuthValidations.verifyEmail),
    AuthControllers.verifyEmail,
);
router.post(
    '/login',
    validateRequest(AuthValidations.login),
    AuthControllers.login,
);

export const AuthRoutes = router;
