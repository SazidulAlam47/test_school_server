import status from 'http-status';
import ApiError from '../../errors/ApiError';
import { TDecodedUser } from '../../interface/jwt.interface';
import { User } from '../user/user.model';
import { Certificate } from './certificate.model';

const getUserCertificate = async (
    decodedUser: TDecodedUser,
    baseUrl: string,
) => {
    const user = await User.findOne({ email: decodedUser.email });

    if (!user) {
        throw new ApiError(status.NOT_FOUND, 'User not found');
    }

    const certificate = await Certificate.findOne({ userId: user._id });

    if (!certificate) {
        throw new ApiError(status.NOT_FOUND, 'Certificate not found');
    }

    return {
        name: user.name,
        level: certificate.level,
        issuedAt: certificate.issuedAt,
        downloadUrl: `${baseUrl}${certificate.certificatePath}`,
    };
};

const getAllCertificates = async (baseUrl: string) => {
    const certificates = await Certificate.find();

    return certificates.map((certificate) => ({
        level: certificate.level,
        issuedAt: certificate.issuedAt,
        downloadUrl: `${baseUrl}${certificate.certificatePath}`,
    }));
};

export const CertificateServices = {
    getUserCertificate,
    getAllCertificates,
};
