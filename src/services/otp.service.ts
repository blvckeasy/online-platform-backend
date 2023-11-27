import { ICreateOTPinput, ICreatedOTPResponse } from "../interfaces/otp.interface";
import { generateRandomNumber } from "../utils/generate-code";
import { client } from "../utils/pg";

export class OTPService {
    static async create (createOTPinput: ICreateOTPinput): Promise<ICreatedOTPResponse> {
        const { telegram_user_id } = createOTPinput;
        const foundOTPs = (await client.query(`
            SELECT * FROM opt WHERE telegram_user_id = $1 and NOW() < sended_time + INTERVAL '1 minute'; 
        `)).rows;

        if (foundOTPs.length) {
            await client.query(`
                DELETE FROM otp WHERE telegram_user_id = $1;
            `, [telegram_user_id]);
        }

        const randomCode: number = generateRandomNumber();
        const newCode: ICreatedOTPResponse = (await client.query(`
            INSERT INTO otp (telegram_user_id, code) VALUES ($1, $2) RETURNING *;
        `, [telegram_user_id, randomCode])).rows[0];

        return newCode;
    }
}