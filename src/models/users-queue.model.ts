import { Client } from "pg";
import { client } from "../utils/pg";

export default class UsersQueueModel {
    private client: Client;

    constructor () {
        this.client = client;
        this.#createDatabaseIfNotExists();
    }

    #createDatabaseIfNotExists () {
        this.client.query(`
            CREATE TABLE IF NOT EXISTS usersqueue (
                ID SERIAL PRIMARY KEY,
                FULLNAME VARCHAR(64) NOT NULL,
                TELEGRAM_USER_ID INT NOT NULL UNIQUE,
                CONTACT VARCHAR(32) NOT NULL UNIQUE,
                ROLE user_role DEFAULT 'student'
            );
        `)
    }
} 