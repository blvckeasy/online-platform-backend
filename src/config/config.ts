import DotEnv from 'dotenv';
import { join } from 'node:path';

DotEnv.config({
    path: join(process.cwd(), '.env')
})

export default () => ({
    serverOptions: {
        PORT: parseInt(process.env.PORT, 10) || 9000,
        HOST: process.env.HOST || "localhost",
    },
    databaseConfig: {
        host: process.env.DB_HOST || "locahost",
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        user: process.env.DB_USER || "postgres",
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        connectionString: process.env.DB_CONNECTION_STRING
    }
})