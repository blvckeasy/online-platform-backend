import { Client } from "pg";
import { client } from "../utils/pg";

export default class UserActivitiesModel {
    private client: Client;

    constructor () {
        this.client = client;
        this.#createDatabaseIfNotExists();
    }

    #createDatabaseIfNotExists () {
        this.client.query(`
            CREATE TABLE IF NOT EXISTS user_activities (
                ID BIGSERIAL PRIMARY KEY,
                USER_ID BIGINT NOT NULL REFERENCES users(ID),
                USER_AGENT VARCHAR(1024) NOT NULL,
                CONNECTED_TIMESTAMP TIMESTAMPTZ DEFAULT NOW(),
                DISCONNECTED_TIMESTAMP TIMESTAMPTZ
            );
        `)
    }
} 