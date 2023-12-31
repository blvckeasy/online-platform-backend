import { ICreateUserQueueInput, IUserQueue } from "../interfaces/users-queue.interface";
import { client } from "../utils/pg";


export class UsersQueueService {
    static async addUser (createUserQueueInput: ICreateUserQueueInput):Promise<IUserQueue> {
        const { fullname, telegram_user_id, contact } = createUserQueueInput;
        const foundUserQueue = (await client.query(`
            SELECT * FROM users_queue WHERE telegram_user_id = $1 or contact = $2;
        `, [telegram_user_id, contact])).rows[0];

        if (foundUserQueue) {
            return foundUserQueue;
        }

        const newUserQueue: IUserQueue = (await client.query(`
            INSERT INTO users_queue (fullname, telegram_user_id, contact) VALUES ($1, $2, $3) RETURNING *;
        `, [fullname, telegram_user_id, contact])).rows[0];

        return newUserQueue
    }

    static async getUser (telegram_user_id: string): Promise<IUserQueue> {
        const foundQueueUser: IUserQueue = (await client.query(`
            SELECT * FROM users_queue WHERE telegram_user_id = $1;
        `, [telegram_user_id])).rows[0];

        return foundQueueUser;
    }

    static async deleteUser (telegram_user_id: string): Promise<IUserQueue> {
        const deletedUser: IUserQueue = (await client.query(`
            DELETE FROM users_queue WHERE telegram_user_id = $1 RETURNING *;
        `, [telegram_user_id])).rows[0];

        return deletedUser
    }
}