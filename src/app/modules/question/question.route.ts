import express from 'express';
import auth from '../../middlewares/auth';
import { QuestionControllers } from './question.controller';

const router = express.Router();

router.post(
    '/',
    auth('admin', 'supervisor'),
    QuestionControllers.createQuestion,
);

export const QuestionRoutes = router;
