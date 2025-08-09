import { UserRoles } from './user.constant';

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
    certificationLevel?: string;
    currentStep: number;
}
