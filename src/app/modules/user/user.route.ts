import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
    '/create-supervisor',
    auth('admin'),
    UserControllers.createSupervisor,
);

export const UserRoutes = router;
