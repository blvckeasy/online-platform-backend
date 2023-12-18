import { Client, ClientConfig } from 'pg';
import { ConfigService } from '../config/config.service';
import initModels from '../models';

export const client: Client = new Client(ConfigService.get<ClientConfig>("databaseConfig"));

function initPostgresqlExtensions (client: Client) {
    client.query(`
        SELECT * FROM pg_type WHERE typname = 'user_role';
    `).then((data) => {
        if (!data.rows.length) {
            client.query(`
                CREATE TYPE user_role AS ENUM ('teacher', 'student', 'admin');
            `)
        }
    })

    client.query(`
        SELECT * FROM pg_type WHERE typname = 'profile_avatar_type';
    `).then((data) => {
        if (!data.rows.length) {
            client.query(`
                CREATE TYPE profile_avatar_type AS ENUM ('teacher', 'student', 'admin');
            `)
        }
    })
}

export async function connectDatabase () {
    try {
        client.connect();
        initPostgresqlExtensions(client);
        initModels();
        console.log("🌳 Database connecting.")
    } catch (error) {
        console.error(error);
        process.exit(0);
    }
}