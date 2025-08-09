import { Schema, model } from 'mongoose';
import { ITestAttempt } from './testAttempt.interface';
import { Steps, TestStatuses } from './testAttempt.constant';
import { Levels } from '../question/question.constant';

const testAttemptSchema = new Schema<ITestAttempt>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        step: {
            type: Number,
            enum: Steps,
            required: true,
        },
        submittedAnswers: [
            {
                questionId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Question',
                    required: true,
                },
                selectedOption: {
                    type: Number,
                    required: true,
                },
                isCorrect: {
                    type: Boolean,
                    required: true,
                },
            },
        ],
        score: {
            type: Number,
            min: 0,
            max: 100,
        },
        status: {
            type: String,
            enum: TestStatuses,
            required: true,
            default: 'in-progress',
        },
        certifiedLevel: {
            type: String,
            enum: Levels,
        },
        startTime: {
            type: Date,
            required: true,
            default: Date.now,
        },
        endTime: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 46 * 60 * 1000),
        },
    },
    {
        timestamps: true,
    },
);

export const TestAttempt = model<ITestAttempt>(
    'TestAttempt',
    testAttemptSchema,
);
