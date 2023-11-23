import { Client, ClientConfig } from 'pg';
import { ConfigService } from '../config/config.service';

export function connectDatabase (): Client {
    const configService = new ConfigService()
    const client = new Client(configService.get<ClientConfig>("databaseConfig"));

    try {
        client.connect();
    } catch (error) {
        console.error(error);
        process.exit(0);
    }

    return client;
}