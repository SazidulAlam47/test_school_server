import { Schema, model } from 'mongoose';
import { IQuestion } from './question.interface';
import { Levels, CorrectAnswers } from './question.constant';

const questionSchema = new Schema<IQuestion>({
    text: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
    correctAnswer: {
        type: Number,
        enum: CorrectAnswers,
        required: true,
    },
    level: {
        type: String,
        enum: Levels,
        required: true,
    },
});

export const Question = model<IQuestion>('Question', questionSchema);
