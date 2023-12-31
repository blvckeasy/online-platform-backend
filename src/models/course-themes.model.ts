import { Client } from "pg";
import { client } from "../utils/pg";


export default class CourseThemesModel {
    private client: Client;

    constructor () {
        this.client = client;
        this.#createTableIfNotExists();
    }

    #createTableIfNotExists () {
        this.client.query(`
            CREATE TABLE IF NOT EXISTS course_themes (
                ID BIGSERIAL PRIMARY KEY,
                COURSE_ID BIGINT NOT NULL REFERENCES courses(id),
                TITLE VARCHAR(128) NOT NULL
            );
        `)
    }
}