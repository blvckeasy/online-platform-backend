import { ICreateUserQueueInput, IUserQueue } from "../interfaces/users-queue.interface";
import { client } from "../utils/pg";
import CustomError from '../utils/error-handler'


export class UsersQueueService {
    static async addUserToQueue (createUserQueueInput: ICreateUserQueueInput):Promise<IUserQueue> {
        try {
            const { fullname, telegram_user_id, contact } = createUserQueueInput;
            const foundUserQueue = (await client.query(`
                SELECT * FROM usersqueue WHERE telegram_user_id = $1 or contact = $2;
            `, [telegram_user_id, contact])).rows[0];

            if (foundUserQueue) {
                return foundUserQueue;
            }

            const newUserQueue: IUserQueue = (await client.query(`
                INSERT INTO usersqueue (fullname, telegram_user_id, contact) VALUES ($1, $2, $3) RETURNING *;
            `, [fullname, telegram_user_id, contact])).rows[0];

            return newUserQueue
        } catch (error) {
            throw await CustomError(error)
        }
    }
}