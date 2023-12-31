import { Client } from "pg";
import { client } from "../utils/pg";

export default class UserProfileAvatarModel {
    private client: Client;

    constructor () {
        this.client = client;
        this.#createDatabaseIfNotExists();
    }

    #createDatabaseIfNotExists () {
        this.client.query(`
            CREATE TABLE IF NOT EXISTS user_profile_avatar (
                ID BIGSERIAL PRIMARY KEY,
                USER_ID BIGINT NOT NULL REFERENCES users(ID),
                TYPE profile_avatar_type DEFAULT 'image',
                GOOGLE_DRIVE_PICTURE_ID VARCHAR(256),
                UPLOADED_TIME TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `)
    }
} 