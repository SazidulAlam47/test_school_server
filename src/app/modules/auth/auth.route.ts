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
    '/verify-email/:userId',
    validateRequest(AuthValidations.verifyEmail),
    AuthControllers.verifyEmail,
);
router.post(
    '/login',
    validateRequest(AuthValidations.login),
    AuthControllers.login,
);

router.post(
    '/change-password',
    validateRequest(AuthValidations.changePassword),
    AuthControllers.changePassword,
);

router.get('/refresh-token', AuthControllers.refreshToken);

router.post(
    '/forget-password',
    validateRequest(AuthValidations.forgetPassword),
    AuthControllers.forgetPassword,
);

router.post(
    '/reset-password',
    validateRequest(AuthValidations.resetPassword),
    AuthControllers.resetPassword,
);

router.get('/logout', AuthControllers.logout);

export const AuthRoutes = router;
