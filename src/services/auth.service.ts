import { IAuthRegisterUserInput } from "../interfaces/auth.interface";
import { IOTP } from "../interfaces/otp.interface";
import { ICreateUserQueueInput, IUserQueue } from "../interfaces/users-queue.interface";
import { OTPService } from "./otp.service";
import CustomError, { ErrorTypes } from '../utils/error-handler'
import { client } from "../utils/pg";
import { AuthorizationFailed, UnauthorizedExcaption } from "../utils/errors";
import { UserService } from "./user.service";
import { UsersQueueService } from "./users-queue.service";
import { IUser } from "../interfaces/user.interface";


export class AuthService {
    static async generateCode (createUserQueueInput: ICreateUserQueueInput): Promise<IOTP> {
        return await OTPService.create(createUserQueueInput)
    }

    static async register (registerUserInput: IAuthRegisterUserInput): Promise<IUser> {
        try {
            const { code } = registerUserInput;

            const foundOTP: IOTP = (await client.query(`
                SELECT * FROM otp WHERE code = $1 AND NOW() < sended_time + INTERVAL '1 minute';
            `, [code])).rows[0];

            if (!foundOTP) throw new UnauthorizedExcaption("Code expired!", ErrorTypes.BAD_USER_INPUT);
    
            if (foundOTP.code === registerUserInput.code) {
                const userInfo: IUserQueue = await UsersQueueService.deleteUser(foundOTP.telegram_user_id);
                const deletedOTP: IOTP = await OTPService.delete({ telegram_user_id: userInfo.telegram_user_id }); // delete otp code

                const newUser: IUser = await UserService.createUser({
                    telegram_user_id: userInfo.telegram_user_id,
                    contact: userInfo.contact,
                    fullname: userInfo.fullname,
                    role: userInfo.role
                })

                return newUser;
            }

            throw new AuthorizationFailed("Wrong code!", ErrorTypes.BAD_USER_INPUT);
        } catch (error) {
            throw await CustomError(error);
        }
    }
}