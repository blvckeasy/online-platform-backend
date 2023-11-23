import { Client } from "pg";
import { connectDatabase } from "../utils/pg";

class UserModel {
    private client: Client;

    constructor () {
        this.client = connectDatabase();
        this.#createTableIfNotExists();
    }

    #createTableIfNotExists () {
        this.client.query(`
            CREATE TABLE IF NOT EXISTS users (
                ID SERIAL PRIMARY KEY,
                FULLNAME VARCHAR(64) NOT NULL,
                PASSWORD VARCHAR(64) NOT NULL,
                TELEGRAM_USER_ID INT UNIQUE,
                CONTACT VARCHAR(32) UNIQUE,
                ROLE user_role DEFAULT 'student', 
                SIGNED_TIME TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP 
            );
        `)
    }

    async create (params) {

    }
}

new UserModel();