import { Client } from "pg";
import { client } from "../utils/pg";


export default class CourseVideosModel {
    private client: Client;

    constructor () {
        this.client = client;
        this.#createTableIfNotExists();
    }

    #createTableIfNotExists () {
        this.client.query(`
            CREATE TABLE IF NOT EXISTS course_videos (
                ID SERIAL PRIMARY KEY,
                GOOGLE_DRIVE_VIDEO_ID VARCHAR,
                THEME_ID INT NOT NULL REFERENCES course_themes(id),
                TITLE VARCHAR(128) NOT NULL,
                DESCRIPTION VARCHAR,
                UPLOADED_AT TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `)
    }
}