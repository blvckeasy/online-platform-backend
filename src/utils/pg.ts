import { Client, ClientConfig } from 'pg';
import { ConfigService } from '../config/config.service';
import initModels from '../models';

const config = ConfigService.get<ClientConfig>("databaseConfig");

export const client: Client = new Client(config);

async function initPostgresqlExtensions (client: Client) {
    await client.query(`
        SELECT * FROM pg_type WHERE typname = 'user_role';
    `).then((data) => {
        if (!data.rows.length) {
            client.query(`
                CREATE TYPE user_role AS ENUM ('teacher', 'student', 'admin');
            `)
        }
    })

    await client.query(`
        SELECT * FROM pg_type WHERE typname = 'profile_avatar_type';
    `).then((data) => {
        if (!data.rows.length) {
            client.query(`
                CREATE TYPE profile_avatar_type AS ENUM ('image', 'gif', 'video');
            `)
        }
    })
}

export async function connectDatabase () {
    try {
        await client.connect();
        await initPostgresqlExtensions(client);
        await initModels();
        console.log("🌳 Database connecting.")
    } catch (error) {
        console.error(error);
        process.exit(0);
    }
}