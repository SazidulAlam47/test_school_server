import { JwtPayload } from 'jsonwebtoken';
import { TUserRole } from '../modules/user/user.interface';

export type TDecodedUser = {
    email: string;
    role: TUserRole;
} & JwtPayload;
