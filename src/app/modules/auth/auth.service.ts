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
import { createToken, verifyToken } from '../../utils/token';
import { TDecodedUser } from '../../interface/jwt.interface';

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

    const accessToken = createToken(
        jwtPayload,
        config.jwt.access_token_secret as Secret,
        config.jwt.access_token_expires_in as ms.StringValue,
    );

    const refreshToken = createToken(
        jwtPayload,
        config.jwt.refresh_token_secret as Secret,
        config.jwt.refresh_token_expires_in as ms.StringValue,
    );

    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange,
        role: user.role,
    };
};

const changePassword = async (
    decodedUser: TDecodedUser,
    payload: { oldPassword: string; newPassword: string },
) => {
    const user = await User.findOne({ email: decodedUser.email }).select(
        '+password',
    );

    if (!user) {
        throw new ApiError(status.NOT_FOUND, 'User not fund');
    }

    // checking password
    const isCorrectPassword = await comparePassword(
        payload.oldPassword,
        user.password,
    );

    if (!isCorrectPassword) {
        throw new ApiError(status.UNAUTHORIZED, 'Password did not matched');
    }

    const newHashedPassword = await hashPassword(payload.newPassword);

    await User.findOneAndUpdate(
        {
            id: decodedUser.id,
            role: decodedUser.role,
        },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date(),
        },
        {
            new: true,
        },
    );
    return null;
};

const refreshToken = async (refreshToken: string) => {
    // check the token is valid
    const decodedUser = verifyToken(
        refreshToken,
        config.jwt.refresh_token_secret as string,
    );

    const user = await User.findOne({ email: decodedUser.email });

    if (!user) {
        throw new ApiError(status.NOT_FOUND, 'User not fund');
    }

    const jwtPayload = {
        email: user.email,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt.access_token_secret as Secret,
        config.jwt.access_token_expires_in as ms.StringValue,
    );

    return { accessToken };
};

const forgetPassword = async (email: string) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(status.NOT_FOUND, 'User not fund');
    }

    const jwtPayload = {
        email: user.email,
        role: user.role,
    };

    const resetToken = createToken(
        jwtPayload,
        config.jwt.reset_pass_secret as string,
        '10m',
    );

    const resetLink = `${config.client_url}/reset-password?id=${user.id}&token=${resetToken}`;

    const subject = 'Reset Password';
    const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
            <p>Hello ${user.id},</p>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            </div>
            <p>If you didn’t request this, you can safely ignore this email.</p>
            <p>Regards,</p>
            <p><strong>Apollo University</strong></p>
        </div>
        `;

    await sendEmail(user.email, subject, htmlBody);

    return null;
};

const resetPassword = async (
    tokenBearer: string,
    payload: { id: string; password: string },
) => {
    if (!tokenBearer) {
        throw new ApiError(status.FORBIDDEN, 'Forbidden access');
    }
    const token = tokenBearer.split(' ')[1]; // Extract token after "Bearer"
    if (!token) {
        throw new ApiError(status.FORBIDDEN, 'Forbidden access');
    }

    const decoded = verifyToken(token, config.jwt.reset_pass_secret as Secret);

    const user = await User.findById(payload.id);

    if (!user) {
        throw new ApiError(status.NOT_FOUND, 'User not fund');
    }

    // check payload email and decoded email
    if (decoded.email !== user.email) {
        throw new ApiError(status.FORBIDDEN, 'Forbidden access');
    }

    const hashedPassword = await hashPassword(payload.password);

    await User.findByIdAndUpdate(
        user._id,
        {
            password: hashedPassword,
            needsPasswordChange: false,
        },
        {
            new: true,
        },
    );
    return null;
};

export const AuthServices = {
    registerStudent,
    verifyEmail,
    login,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
