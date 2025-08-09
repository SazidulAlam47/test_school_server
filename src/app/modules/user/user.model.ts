import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';
import { UserRoles } from './user.constant';
import { Steps } from '../testAttempt/testAttempt.constant';
import { Levels } from '../question/question.constant';

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: 0,
        },
        role: {
            type: String,
            enum: UserRoles,
            required: true,
            default: 'student',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
            select: 0,
        },
        otpExpiresAt: {
            type: Number,
            select: 0,
        },
        needPasswordChange: {
            type: Boolean,
            required: true,
            default: true,
        },
        certificationLevel: {
            type: String,
            enum: Levels,
        },
        currentStep: {
            type: Number,
            enum: Steps,
        },
    },
    {
        timestamps: true,
    },
);

export const User = model<IUser>('User', userSchema);
