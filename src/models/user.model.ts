import { Client } from "pg";
import { connectDatabase } from "../utils/pg";

class UserModel {
    private readonly client: Client
    constructor () {
        this.client = connectDatabase();
    }

    createTableIfNotExists () {
        this.client.query(`
            CREATE TABLE IF NOT EXISTS users (
                
            );
        `)
    }
}