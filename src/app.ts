import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import createCertificateFolder from './app/utils/createCertificateFolder';

const app: Application = express();

createCertificateFolder();

// parsers
app.use(express.json());
app.use(cors());
app.use(
    '/certificates',
    express.static(path.join(process.cwd(), 'certificates')),
);

const test = (req: Request, res: Response) => {
    res.send({ message: 'Test School Server is Running...' });
};

// test route
app.get('/', test);

// application routes
app.use('/api/v1', router);

// global error handler
app.use(globalErrorHandler);

// not found route
app.use(notFound);

export default app;
