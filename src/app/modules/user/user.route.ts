import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { UserValidations } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
    '/create-supervisor',
    auth('admin'),
    validateRequest(UserValidations.createSupervisor),
    UserControllers.createSupervisor,
);

export const UserRoutes = router;
