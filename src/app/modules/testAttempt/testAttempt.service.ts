import status from 'http-status';
import ApiError from '../../errors/ApiError';
import { TDecodedUser } from '../../interface/jwt.interface';
import { User } from '../user/user.model';
import { TestAttempt } from './testAttempt.model';
import { TSubmitAnswersPayload, TTestStatus } from './testAttempt.interface';
import { Question } from '../question/question.model';
import { TLevel } from '../question/question.interface';

const startTest = async (decodedUser: TDecodedUser) => {
    const user = await User.findOne({ email: decodedUser.email });

    if (!user) {
        throw new ApiError(status.NOT_FOUND, 'User not found');
    }

    if (user.role !== 'student') {
        throw new ApiError(status.FORBIDDEN, 'Only students can start a test');
    }

    const payload = {
        userId: user._id,
        step: user.currentStep!,
    };

    const existingTestAttempt = await TestAttempt.findOne(payload);

    if (existingTestAttempt) {
        throw new ApiError(
            status.CONFLICT,
            'You are not eligible for this test',
        );
    }

    const result = await TestAttempt.create(payload);

    return result;
};

const submitAnswers = async (
    testAttemptId: string,
    payload: TSubmitAnswersPayload,
) => {
    const testAttempt = await TestAttempt.findById(testAttemptId);

    if (!testAttempt) {
        throw new ApiError(status.NOT_FOUND, 'Test attempt not found');
    }

    // check if the time is over
    if (new Date(testAttempt.endTime) < new Date()) {
        throw new ApiError(status.FORBIDDEN, 'Test time is over');
    }

    // check the answers and calculate score
    let correctAnswers = 0;
    const totalQuestions = payload.answers.length;

    if (totalQuestions !== 44) {
        throw new ApiError(status.BAD_REQUEST, 'Invalid number of answers');
    }

    const submittedAnswers = await Promise.all(
        payload.answers.map(async (answer) => {
            const question = await Question.findById(answer.questionId);

            if (!question) {
                throw new ApiError(status.NOT_FOUND, 'Question not found');
            }
            const isCorrect = question.correctAnswer === answer.selectedOption;
            if (isCorrect) {
                correctAnswers += 1;
            }
            return {
                questionId: answer.questionId,
                selectedOption: answer.selectedOption,
                isCorrect,
            };
        }),
    );

    const score = (correctAnswers / totalQuestions) * 100;

    let testStatus: TTestStatus = 'failed';
    let certifiedLevel: TLevel | undefined;

    if (testAttempt.step === 1) {
        if (score < 25) {
            testStatus = 'failed';
            certifiedLevel = undefined;
        } else if (score >= 25 && score < 50) {
            testStatus = 'completed';
            certifiedLevel = 'A1';
        } else if (score >= 50 && score < 75) {
            testStatus = 'completed';
            certifiedLevel = 'A2';
        } else if (score >= 75) {
            testStatus = 'promoted';
            certifiedLevel = 'A2';
        }
    } else if (testAttempt.step === 2) {
        if (score < 25) {
            testStatus = 'failed';
            certifiedLevel = 'A2';
        } else if (score >= 25 && score < 50) {
            testStatus = 'completed';
            certifiedLevel = 'B1';
        } else if (score >= 50 && score < 75) {
            testStatus = 'completed';
            certifiedLevel = 'B2';
        } else if (score >= 75) {
            testStatus = 'promoted';
            certifiedLevel = 'B2';
        }
    } else if (testAttempt.step === 3) {
        if (score < 25) {
            testStatus = 'failed';
            certifiedLevel = 'B2';
        } else if (score >= 25 && score < 50) {
            testStatus = 'completed';
            certifiedLevel = 'C1';
        } else if (score >= 50) {
            testStatus = 'completed';
            certifiedLevel = 'C2';
        }
    }

    if (testStatus === 'promoted') {
        const nextStep = testAttempt.step + 1;
        await User.findByIdAndUpdate(testAttempt.userId, {
            currentStep: nextStep,
            certifiedLevel,
        });
    } else if (certifiedLevel) {
        await User.findByIdAndUpdate(testAttempt.userId, {
            certifiedLevel,
        });
    }

    const result = await TestAttempt.findByIdAndUpdate(
        testAttempt._id,
        {
            submittedAnswers,
            score,
            status: testStatus,
            certifiedLevel,
        },
        { new: true },
    );

    return result;
};

export const TestAttemptServices = {
    startTest,
    submitAnswers,
};
