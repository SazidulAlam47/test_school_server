import express from 'express';
import auth from '../../middlewares/auth';
import { TestAttemptControllers } from './testAttempt.controller';
import validateRequest from '../../middlewares/validateRequest';
import { TestAttemptValidations } from './testAttempt.validation';

const router = express.Router();

router.get(
    '/my-attempts',
    auth('student'),
    TestAttemptControllers.getMyAttempts,
);

router.post('/start-test', auth('student'), TestAttemptControllers.startTest);

router.post(
    '/submit-answers/:id',
    auth('student'),
    validateRequest(TestAttemptValidations.submitAnswers),
    TestAttemptControllers.submitAnswers,
);

export const TestAttemptRoutes = router;
