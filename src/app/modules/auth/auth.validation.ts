import z from 'zod';

const registerStudent = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string(),
});

const verifyEmail = z.object({
    otp: z.string(),
});

const login = z.object({
    email: z.email(),
    password: z.string(),
});

const changePassword = z.object({
    oldPassword: z.string().min(1),
    newPassword: z.string().min(6),
});

const forgetPassword = z.object({
    email: z.string().email(),
});

const resetPassword = z.object({
    id: z.string().min(1),
    password: z.string().min(6),
});

export const AuthValidations = {
    registerStudent,
    verifyEmail,
    login,
    changePassword,
    forgetPassword,
    resetPassword,
};
