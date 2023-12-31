import { Client } from "pg";
import { client } from "../utils/pg";


export default class CoursesModel {
    private client: Client;

    constructor () {
        this.client = client;
        this.#createTableIfNotExists();
    }

    #createTableIfNotExists () {
        this.client.query(`
            CREATE TABLE IF NOT EXISTS courses (
                ID BIGSERIAL PRIMARY KEY,
                USER_ID BIGINT NOT NULL REFERENCES users(id),
                GOOGLE_DRIVE_THUMBNAIL_ID VARCHAR(256) NOT NULL,
                TITLE VARCHAR(128) NOT NULL,
                DESCRIPTION VARCHAR,
                PRICE FLOAT
            );
        `)
    }
}