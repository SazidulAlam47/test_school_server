import express from 'express';
import auth from '../../middlewares/auth';
import { TestAttemptControllers } from './testAttempt.controller';

const router = express.Router();

router.post('/start-test', auth('student'), TestAttemptControllers.startTest);

export const TestAttemptRoutes = router;
