import status from 'http-status';
import ApiError from '../../errors/ApiError';
import { comparePassword, hashPassword } from '../../utils/bcrypt';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import {
    TLoginPayload,
    TStudentRegisterPayload,
    TVerifyEmailPayload,
} from './auth.interface';
import generateOtpEmail from '../../utils/generateOtpEmail';
import sendEmail from '../../utils/sendEmail';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import ms from 'ms';
import { createToken } from '../../utils/token';

const registerStudent = async (payload: TStudentRegisterPayload) => {
    const isUserExists = await User.findOne({ email: payload.email });

    if (isUserExists) {
        throw new ApiError(status.CONFLICT, 'This Email is Already registered');
    }

    const hashedPassword = await hashPassword(payload.password);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await hashPassword(otp);
    const otpExpiresAt = Date.now() + 300000;

    const newUser: IUser = {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        isVerified: false,
        otp: hashedOtp,
        otpExpiresAt,
        role: 'student',
        needPasswordChange: false,
        currentStep: 1,
    };

    // create the user
    const createdUser = await User.create(newUser);

    // send otp through email
    const emailSubject = 'Please verify your email';
    const emailBody = generateOtpEmail(payload.name, otp);
    await sendEmail(newUser.email, emailSubject, emailBody);

    // Return user without sensitive fields
    const userResponse = await User.findById(createdUser._id);
    return userResponse;
};

const verifyEmail = async (payload: TVerifyEmailPayload) => {
    const user = await User.findOne({ email: payload.email }).select(
        '+otp +otpExpiresAt',
    );

    if (!user) {
        throw new ApiError(status.NOT_FOUND, 'User not found');
    }

    if (user.isVerified) {
        throw new ApiError(status.CONFLICT, 'User is already verified');
    }

    const now = Date.now();

    if (!user.otpExpiresAt || !user.otp || now > user.otpExpiresAt) {
        throw new ApiError(status.BAD_REQUEST, 'OTP has expired');
    }

    const isCorrectOtp = await comparePassword(payload.otp, user.otp);

    if (!isCorrectOtp) {
        throw new ApiError(status.FORBIDDEN, 'Incorrect OTP');
    }

    // Update user verification status and clear OTP fields
    const result = await User.findByIdAndUpdate(
        user._id,
        {
            $set: {
                isVerified: true,
            },
            $unset: {
                otp: 1,
                otpExpiresAt: 1,
            },
        },
        {
            new: true,
        },
    );

    return result;
};

const login = async (payload: TLoginPayload) => {
    const user = await User.findOne({ email: payload.email }).select(
        '+password',
    );

    if (!user) {
        throw new ApiError(status.UNAUTHORIZED, 'Invalid credentials');
    }

    if (!user.isVerified) {
        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await hashPassword(otp);
        const otpExpiresAt = Date.now() + 300000;

        // Update user with new OTP
        await User.findByIdAndUpdate(user._id, {
            otp: hashedOtp,
            otpExpiresAt,
        });

        // Send OTP email
        const emailSubject = 'Please verify your email';
        const emailBody = generateOtpEmail(user.name, otp);
        await sendEmail(user.email, emailSubject, emailBody);

        throw new ApiError(
            status.PRECONDITION_FAILED,
            'User Email is not verified. A new OTP has been sent to your email.',
        );
    }

    const isCorrectPassword = await comparePassword(
        payload.password,
        user.password,
    );

    if (!isCorrectPassword) {
        throw new ApiError(status.UNAUTHORIZED, 'Invalid credentials');
    }

    const jwtPayload = {
        email: user.email,
        role: user.role,
    };

    const token = createToken(
        jwtPayload,
        config.jwt.access_token_secret as Secret,
        config.jwt.access_token_expires_in as ms.StringValue,
    );

    return {
        token,
        needPasswordChange: user.needPasswordChange,
        role: user.role,
    };
};

export const AuthServices = {
    registerStudent,
    verifyEmail,
    login,
};
