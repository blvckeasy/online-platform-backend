import { IAuthRegisterUserInput } from "../interfaces/auth.interface";
import { IOTP } from "../interfaces/otp.interface";
import { ICreateUserQueueInput, IUserQueue } from "../interfaces/users-queue.interface";
import { OTPService } from "./otp.service";
import CustomError, { ErrorTypes } from '../utils/error-handler'
import { client } from "../utils/pg";
import { UnauthorizedExcaption } from "../utils/errors";
import { UserService } from "./user.service";
import { UsersQueueService } from "./users-queue.service";
import { IUser } from "../interfaces/user.interface";


export class AuthService {
    static async generateCode (createUserQueueInput: ICreateUserQueueInput): Promise<IOTP> {
        return await OTPService.create(createUserQueueInput)
    }

    static async register (registerUserInput: IAuthRegisterUserInput) {
        try {
            const foundOTP: IOTP = (await client.query(`
                SELECT * FROM otp WHERE telegram_user_id = $1 AND sended_time + INTERVAL '1 minute';
            `,)).rows[0];

            if (!foundOTP) throw new UnauthorizedExcaption("you have not been given a code!", ErrorTypes.BAD_USER_INPUT);

            if (foundOTP.code === registerUserInput.code) {
                const userInfo: IUserQueue = await UsersQueueService.deleteUser(foundOTP.telegram_user_id);

                const newUser: IUser = await UserService.createUser({
                    telegram_user_id: userInfo.telegram_user_id,
                    contact: userInfo.contact,
                    fullname: userInfo.fullname,
                    role: userInfo.role
                })
            }

            console.log()
        } catch (error) {
            throw await CustomError(error);
        }
    }
}