import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { QuestionRoutes } from '../modules/question/question.route';

const router = Router();

const moduleRoutes = [
    {
        path: '/users',
        route: UserRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/questions',
        route: QuestionRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
