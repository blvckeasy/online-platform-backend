import { Client } from "pg";
import { client } from "../utils/pg";


export default class FAQModel {
    private client: Client;

    constructor () {
        this.client = client;
        this.#createTableIfNotExists();
    }

    #createTableIfNotExists () {
        this.client.query(`
            CREATE TABLE IF NOT EXISTS faq (
                ID SERIAL PRIMARY KEY,
                question VARCHAR(1024) NOT NULL,
                answer VARCHAR(1024) NOT NULL
            );
        `)
    }
}