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
                ID SERIAL PRIMARY KEY,
                USER_ID INT NOT NULL REFERENCES users(id),
                THUMBNAIL_URL VARCHAR(256) NOT NULL,
                TITLE VARCHAR(128) NOT NULL,
                PRICE FLOAT
            );
        `)
    }
}