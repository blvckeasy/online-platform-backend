import { ICreateOTPinput, IOTP } from "../interfaces/otp.interface";
import ErrorHandler from "../utils/error-handler";
import { generateRandomNumber } from "../utils/generate-code";
import { client } from "../utils/pg";
import { UsersQueueService } from "./users-queue.service";

export class OTPService {
    static async create (createOTPinput: ICreateOTPinput): Promise<IOTP> {        
        try {
            const { telegram_user_id } = createOTPinput;
            const foundOTP: IOTP = (await client.query(`
                SELECT * FROM otp WHERE telegram_user_id = $1 and NOW() < sended_time + INTERVAL '1 minute'; 
            `, [telegram_user_id])).rows[0];
    
            if (foundOTP) return foundOTP;
    
            const addedUserQueue = await UsersQueueService.addUser(createOTPinput);
            const randomCode: number = await generateRandomNumber();
            const newCode: IOTP = (await client.query(`
                INSERT INTO otp (telegram_user_id, code) VALUES ($1, $2) RETURNING *;
            `, [telegram_user_id, randomCode])).rows[0];
    
            return newCode;
        } catch (error) {
            throw await ErrorHandler(error);
        }
    }
}