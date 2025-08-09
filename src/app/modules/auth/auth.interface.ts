import z from 'zod';
import { AuthValidations } from './auth.validation';

export type TStudentRegisterPayload = z.infer<
    typeof AuthValidations.registerStudent
>;

export type TVerifyEmailPayload = z.infer<typeof AuthValidations.verifyEmail>;

export type TLoginPayload = z.infer<typeof AuthValidations.login>;
