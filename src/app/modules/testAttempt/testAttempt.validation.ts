import z from 'zod';

const submitAnswers = z.object({
    answers: z
        .array(
            z.object({
                questionId: z.string(),
                selectedOption: z.number().min(0).max(3),
            }),
        )
        .min(1, 'At least one answer is required'),
});

export const TestAttemptValidations = {
    submitAnswers,
};
