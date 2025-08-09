import z from 'zod';

const createSupervisor = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string(),
});

export const UserValidations = {
    createSupervisor,
};
