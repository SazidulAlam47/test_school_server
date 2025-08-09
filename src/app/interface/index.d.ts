import { TDecodedUser } from './jwt.interface';

declare global {
    namespace Express {
        interface Request {
            user: TDecodedUser;
        }
    }
}
