import { Schema, model } from 'mongoose';
import { TCertificate } from './certificate.interface';
import { Levels } from '../question/question.constant';

const certificateSchema = new Schema<TCertificate>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        level: {
            type: String,
            enum: Levels,
            required: true,
        },
        issuedAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    },
);

export const Certificate = model<TCertificate>(
    'Certificate',
    certificateSchema,
);
