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

export const AuthValidations = {
    registerStudent,
    verifyEmail,
    login,
};
