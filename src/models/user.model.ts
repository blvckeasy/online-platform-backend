import { Client } from "pg";
import { client } from "../utils/pg";
import { ICreateUserModel } from "./interface/create-user-model.interface";
import { AlreadyExistsExcaption } from "../utils/errors";
import { IUser } from "./interface/user.interface";
import { ErrorTypes } from "../utils/error-handler";

export default class UserModel {
    private client: Client;

    constructor () {
        this.client = client;
        this.#createTableIfNotExists();
    }

    #createTableIfNotExists () {
        this.client.query(`            
            CREATE TABLE IF NOT EXISTS users (
                ID BIGSERIAL PRIMARY KEY,
                FULLNAME VARCHAR(64) DEFAULT 'student',
                TELEGRAM_USER_ID BIGINT NOT NULL UNIQUE,
                CONTACT VARCHAR(32) NOT NULL UNIQUE,
                ROLE user_role DEFAULT 'student', 
                SIGNED_TIME TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP 
            );
        `)
    }

    async create (createUserParams: ICreateUserModel): Promise<IUser | void> {
        const { fullname, contact, role, telegram_user_id } = createUserParams;
        const result = await this.client.query(`
            SELECT * FROM USERS WHERE contact = $1 or telegram_user_id = $2 LIMIT 1;
        `, [contact, telegram_user_id])
        const foundUser = result.rows[0];
        if (foundUser) throw new AlreadyExistsExcaption("User is already exists", ErrorTypes.BAD_USER_INPUT);
        
        const newUser = (await this.client.query(`
            INSERT INTO users (FULLNAME, CONTACT, ROLE) VALUES ($1, $2, $3) RETURNING *;
        `, [ fullname, contact, role])).rows[0];
        return newUser;
    }
}