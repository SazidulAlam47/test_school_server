import z from 'zod';
import { UserRoles } from './user.constant';
import { UserValidations } from './user.validation';
import { TStep } from '../testAttempt/testAttempt.interface';
import { TLevel } from '../question/question.interface';

export type TUserRole = (typeof UserRoles)[number];

export interface IUser {
    name: string;
    email: string;
    password: string;
    role: TUserRole;
    isVerified: boolean;
    otp?: string;
    otpExpiresAt?: number;
    needPasswordChange: boolean;
    certificationLevel?: TLevel;
    currentStep?: TStep;
}

export type TCreateSupervisorPayload = z.infer<
    typeof UserValidations.createSupervisor
>;
