import status from 'http-status';
import ApiError from '../../errors/ApiError';
import { TDecodedUser } from '../../interface/jwt.interface';
import { User } from '../user/user.model';
import { Certificate } from './certificate.model';
import generateCertificatePdf from '../../utils/generateCertificatePdf';
import sendCertificateEmail from '../../utils/sendCertificateEmail';

const getUserCertificate = async (decodedUser: TDecodedUser) => {
    const user = await User.findOne({ email: decodedUser.email });

    if (!user) {
        throw new ApiError(status.NOT_FOUND, 'User not found');
    }

    const certificate = await Certificate.findOne({ userId: user._id });

    if (!certificate) {
        throw new ApiError(status.NOT_FOUND, 'Certificate not found');
    }

    const result = {
        name: user.name,
        level: certificate.level,
        issuedAt: certificate.issuedAt,
    };

    const certificatePdfBuffer = await generateCertificatePdf(
        user.name,
        certificate.level,
        certificate.issuedAt,
    );

    // Send certificate via email
    await sendCertificateEmail(
        user.email,
        user.name,
        certificate.level,
        certificatePdfBuffer,
    );

    return result;
};

const getAllCertificates = async () => {
    const certificates = await Certificate.find();

    const result = await Promise.all(
        certificates.map(async (certificate) => {
            const user = await User.findById(certificate.userId);
            const userName = user ? user.name : 'User';
            const userEmail = user ? user.email : null;
            return {
                name: userName,
                email: userEmail,
                level: certificate.level,
                issuedAt: certificate.issuedAt,
            };
        }),
    );

    return result;
};

export const CertificateServices = {
    getUserCertificate,
    getAllCertificates,
};
