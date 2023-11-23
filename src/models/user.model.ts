import { Client } from "pg";
import { connectDatabase } from "../utils/pg";

class UserModel {
    private readonly client: Client
    constructor () {
        this.client = connectDatabase();
    }

    createTableIfNotExists () {
        this.client.query(`
            // CREATE TABLE IF NOT EXISTS users (
            //     ID SERIAL PRIMARY KEY,
            //     FULLNAME VARCHAR(64) NOT NULL,
            //     PASSWORD VARCHAR(64) NOT NULL,
            //     TELEGRAM_USER_ID UNIQUE,
            //     CONTACT VARCHAR(32) UNQIUE,
            //     ROLE_ID REFERENCES () 
            );
        `)
    }
}