import { Types } from 'mongoose';
import { TLevel } from '../question/question.interface';

export interface TCertificate {
    userId: Types.ObjectId;
    level: TLevel;
    issuedAt: Date;
}
