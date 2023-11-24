import { Client } from "pg";
import { connectDatabase } from "../utils/pg";
import { ICreateUserModel } from "./interface/createUserModel.interface";
import { AlreadyExistsExcaption } from "../utils/errors";
import { IUser } from "./interface/user.interface";
import { EUserRole } from "./enums/userRole.enum";

class UserModel {
    private client: Client;

    constructor () {
        this.client = connectDatabase();
        this.#createTableIfNotExists();
    }

    #createTableIfNotExists () {
        this.client.query(`
            CREATE TABLE IF NOT EXISTS users (
                ID SERIAL PRIMARY KEY,
                FULLNAME VARCHAR(64) NOT NULL,
                TELEGRAM_USER_ID INT UNIQUE,
                CONTACT VARCHAR(32) UNIQUE,
                ROLE user_role DEFAULT 'student', 
                SIGNED_TIME TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP 
            );
        `)
    }

    async create (createUserParams: ICreateUserModel): Promise<IUser | void> {
        const { fullname, contact, role } = createUserParams;

        const result = await this.client.query(`
            SELECT * FROM USERS WHERE contact = $1 LIMIT 1;
        `, [contact])
        const foundUser = result.rows[0];
    
        if (foundUser) throw new AlreadyExistsExcaption("User is already exists");

        const newUser = (await this.client.query(`
            INSERT INTO users (FULLNAME, CONTACT, ROLE) VALUES ($1, $2, $3) RETURNING *;
        `, [ fullname, contact, role || "STUDENT"])).rows[0];

        return newUser;
    }
}

const userModel = new UserModel();
userModel.create({
    contact: "+123123123213123",
    telegram_user_id: 123456123,
    fullname: "Abdurahmonov Islom",
    role: EUserRole.STUDENT,
})