import { Client } from "pg";
import { client } from "../utils/pg";

export default class CoursesRatingsModel {
    private client: Client;

    constructor () {
        this.client = client;
        this.#createDatabaseIfNotExists();
    }

    #createDatabaseIfNotExists () {
        this.client.query(`
            CREATE TABLE IF NOT EXISTS courses_ratings (
                ID BIGSERIAL PRIMARY KEY,
                USER_ID BIGINT REFERENCES users(ID),
                COURSE_ID BIGINT REFERENCES courses(ID),
                RATING SMALLINT NOT NULL,
                REATED_AT TIMESTAMPTZ DEFAULT NOW()
            );
        `)
    }
} 