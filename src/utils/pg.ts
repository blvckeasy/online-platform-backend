import { Client, ClientConfig } from 'pg';
import { ConfigService } from '../config/config.service';

function initPostgresqlExtensions (client: Client) {
    client.query(`
        SELECT * FROM pg_type WHERE typname = 'user_role';
    `).then((data) => {
        if (!data.rows.length) {
            client.query(`
                CREATE TYPE IF NOT EXISTS user_role AS ENUM ('teacher', 'student', 'admin');
            `)
        }
    })

}

export function connectDatabase (): Client {
    const configService = new ConfigService()
    const client = new Client(configService.get<ClientConfig>("databaseConfig"));

    try {
        client.connect();
        initPostgresqlExtensions(client);
    } catch (error) {
        console.error(error);
        process.exit(0);
    }

    return client;
}