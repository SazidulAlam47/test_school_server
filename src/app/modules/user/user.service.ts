import status from 'http-status';
import ApiError from '../../errors/ApiError';
import { IUser, TCreateSupervisorPayload } from './user.interface';
import { User } from './user.model';
import { hashPassword } from '../../utils/bcrypt';

const createSupervisor = async (payload: TCreateSupervisorPayload) => {
    const isUserExists = await User.findOne({ email: payload.email });

    if (isUserExists) {
        throw new ApiError(status.CONFLICT, 'This Email is Already registered');
    }

    const hashedPassword = await hashPassword(payload.password);

    const newUser: IUser = {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        isVerified: true,
        role: 'supervisor',
        needPasswordChange: true,
    };

    // create the user
    const createdUser = await User.create(newUser);

    // Return user without sensitive fields
    const userResponse = await User.findById(createdUser._id);
    return userResponse;
};

export const UserServices = {
    createSupervisor,
};
