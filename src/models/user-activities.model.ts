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
                USER_ID BIGINT REFERENCES users(ID),
                IP VARCHAR(64) NOT NULL,
                SOCKET_ID VARCHAR(64) NOT NULL,
                USER_AGENT VARCHAR(1024),
                CONNECTED_TIMESTAMP TIMESTAMP DEFAULT NOW(),
                DISCONNECTED_TIMESTAMP TIMESTAMP
            );
        `)
    }
} 