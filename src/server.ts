/* eslint-disable no-console */
import { Server } from 'http';
import app from './app';
import mongoose from 'mongoose';
import config from './app/config';
import seedAdmin from './app/DB/seedAdmin';

const port = Number(config.port);

let server: Server;

async function main() {
    try {
        await mongoose.connect(config.database_url);

        seedAdmin();

        server = app.listen(port, () => {
            console.log('Test School Server is listening on port', port);
        });
    } catch (error) {
        console.log(error);
    }
}

main();

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.info('Server shutting down ...');
        });
    }
    process.exit(1);
};

process.on('uncaughtException', (error) => {
    console.log(error);
    exitHandler();
});

process.on('unhandledRejection', (error) => {
    console.log(error);
    exitHandler();
});
