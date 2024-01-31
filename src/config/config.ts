import DotEnv from 'dotenv';
import { join } from 'node:path';

DotEnv.config({
    // path: join(process.cwd(), '.env')
})

export default () => ({
    pagination: {
        coursePagtion: {
            page: parseInt(process.env.COURSE_PAGINATION_PAGE, 10) || 1,
            limit: parseInt(process.env.COURSE_PAGINATION_LIMIT, 10) || 12,
        }
    },
    serverOptions: {
        PORT: parseInt(process.env.PORT, 10) || 9000,
        HOST: process.env.HOST,
        PROTOCOL: process.env.SERVER_PROTOCOL || "http",
    },
    databaseConfig: {
        host: process.env.DB_HOST || "locahost",
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        user: process.env.DB_USER || "postgres",
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        connectionString: process.env.DB_CONNECTION_STRING
    },
    botConfig: {
        token: process.env.BOT_TOKEN
    },
    googleApiKey: {
        "type": process.env.GOOGLE_API_KEY_TYPE,
        "project_id": process.env.GOOGLE_API_KEY_PROJECT_ID,
        "private_key_id": process.env.GOOGLE_API_KEY_PRIVATE_KEY_ID,
        "private_key": process.env.GOOGLE_API_KEY_PRIVATE_KEY,
        "client_email": process.env.GOOGLE_API_KEY_CLIENT_EMAIL,
        "client_id": process.env.GOOGLE_API_KEY_CLIENT_ID,
        "auth_uri": process.env.GOOGLE_API_KEY_AUTH_URI,
        "token_uri": process.env.GOOGLE_API_KEY_TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.GOOGLE_API_KEY_AUTH_PROVIDER_X509_CERT_URL,
        "client_x509_cert_url": process.env.GOOGLE_API_KEY_CLIENT_X509_CERT_URL,
        "universe_domain": process.env.GOOGLE_API_KEY_UNIVERSE_DOMAIN,
    }      
})