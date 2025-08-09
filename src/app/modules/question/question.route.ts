import express from 'express';
import auth from '../../middlewares/auth';
import { QuestionControllers } from './question.controller';

const router = express.Router();

router.get(
    '/',
    auth('admin', 'supervisor'),
    QuestionControllers.getAllQuestions,
);
router.get(
    '/:id',
    auth('admin', 'supervisor'),
    QuestionControllers.getQuestionById,
);
router.get(
    '/step/:step',
    auth('student'),
    QuestionControllers.getAllQuestionsByStep,
);

router.post(
    '/',
    auth('admin', 'supervisor'),
    QuestionControllers.createQuestion,
);

export const QuestionRoutes = router;
