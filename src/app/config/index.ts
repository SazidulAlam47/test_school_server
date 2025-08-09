import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    NODE_ENV: process.env.NODE_ENV as string,
    port: process.env.PORT as string,
    database_url: process.env.DATABASE_URL as string,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS as string,
    node_mailer: {
        email: process.env.NODE_MAILER_EMAIL as string,
        password: process.env.NODE_MAILER_PASSWORD as string,
    },
    jwt: {
        access_token_secret: process.env.ACCESS_TOKEN_SECRET as string,
        access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
    },
    admin_password: process.env.ADMIN_PASSWORD as string,
};
