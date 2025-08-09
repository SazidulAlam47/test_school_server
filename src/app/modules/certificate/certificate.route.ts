import { Router } from 'express';
import { CertificateControllers } from './certificate.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.get(
    '/',
    auth('admin', 'supervisor'),
    CertificateControllers.getAllCertificates,
);

router.get(
    '/my-certificate',
    auth('student'),
    CertificateControllers.getUserCertificate,
);

export const CertificateRoutes = router;
