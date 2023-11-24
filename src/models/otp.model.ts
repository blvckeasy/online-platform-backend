import { Client } from "pg";
import { client } from "../utils/pg";

export default class OTPModel {
    private client: Client;

    constructor () {
        this.client = client;
        this.#createTableIfNotExists();
    }

    #createTableIfNotExists () {
        this.client.query(`
            CREATE TABLE IF NOT EXISTS otp (
                ID SERIAL PRIMARY KEY,
                telegram_user_id INT REFERENCES users(ID),
                code INT NOT NULL,
                sended_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }
}