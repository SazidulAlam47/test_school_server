import { hashPassword } from '../utils/bcrypt';
import config from '../config';
import { IUser } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const seedAdmin = async () => {
    const hashedPassword = await hashPassword(config.admin_password);

    const admin: IUser = {
        name: 'Admin',
        email: 'admin@testschool.com',
        isVerified: true,
        needPasswordChange: false,
        role: 'admin',
        password: hashedPassword,
    };

    const isAdminExists = await User.findOne({
        role: 'admin',
    });
    if (!isAdminExists) {
        await User.create(admin);
    }
};
export default seedAdmin;
