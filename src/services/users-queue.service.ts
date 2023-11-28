import { ICreateUserQueueInput, IUserQueue } from "../interfaces/users-queue.interface";
import { client } from "../utils/pg";
import ErrorHandler from '../utils/error-handler';


export class UsersQueueService {
    static async addUser (createUserQueueInput: ICreateUserQueueInput):Promise<IUserQueue> {
        try {
            const { fullname, telegram_user_id, contact } = createUserQueueInput;
            const foundUserQueue = (await client.query(`
                SELECT * FROM users-queue WHERE telegram_user_id = $1 or contact = $2;
            `, [telegram_user_id, contact])).rows[0];

            if (foundUserQueue) {
                return foundUserQueue;
            }

            const newUserQueue: IUserQueue = (await client.query(`
                INSERT INTO users-queue (fullname, telegram_user_id, contact) VALUES ($1, $2, $3) RETURNING *;
            `, [fullname, telegram_user_id, contact])).rows[0];

            return newUserQueue
        } catch (error) {
            throw await ErrorHandler(error)
        }
    }

    static async getUser (telegram_user_id: number): Promise<IUserQueue> {
        try {
            const foundQueueUser: IUserQueue = (await client.query(`
                SELECT * FROM users-queue WHERE telegram_user_id = $1;
            `, [telegram_user_id])).rows[0];

            return foundQueueUser;
        } catch (error) {
            throw await ErrorHandler(error);
        }
    }

    static async deleteUser (telegram_user_id: number): Promise<IUserQueue> {
        try {
            const deletedUser: IUserQueue = (await client.query(`
                DELETE FROM users-queue WHERE telegram_user_id = $1 RETURNING *;
            `, [telegram_user_id])).rows[0];

            return deletedUser
        } catch (error) {
            throw await ErrorHandler(error);
        }
    }
}