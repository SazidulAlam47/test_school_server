import { Types } from 'mongoose';
import { Steps, TestStatuses } from './testAttempt.constant';
import { TLevel } from '../question/question.interface';
import z from 'zod';
import { TestAttemptValidations } from './testAttempt.validation';

export type TStep = (typeof Steps)[number];

export type TTestStatus = (typeof TestStatuses)[number];

export interface ITestAttempt {
    userId: Types.ObjectId;
    step: TStep;
    submittedAnswers?: {
        questionId: Types.ObjectId;
        selectedOption: number;
        isCorrect: boolean;
    }[];
    score?: number;
    status: TTestStatus;
    certifiedLevel?: TLevel;
    startTime: Date;
    endTime: Date;
}

export type TSubmitAnswersPayload = z.infer<
    typeof TestAttemptValidations.submitAnswers
>;
