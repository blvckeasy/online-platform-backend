import { IAuthRegisterUserInput } from "../interfaces/auth.interface";
import { IOTP } from "../interfaces/otp.interface";
import { ICreateUserQueueInput, IUserQueue } from "../interfaces/users-queue.interface";
import { OTPService } from "./otp.service";
import { ErrorTypes } from '../utils/error-handler'
import { client } from "../utils/pg";
import { AuthorizationFailed, UnauthorizedExcaption } from "../utils/errors";
import { UserService } from "./user.service";
import { UsersQueueService } from "./users-queue.service";
import { IUser } from "../interfaces/user.interface";
import { addMinutes } from "../utils/time";


export class AuthService {
    static async generateCode (createUserQueueInput: ICreateUserQueueInput): Promise<IOTP> {
        return await OTPService.create(createUserQueueInput)
    }

    static async register (registerUserInput: IAuthRegisterUserInput): Promise<IUser> {
        const { code } = registerUserInput;
        const foundOTP: IOTP = (await client.query(`
            SELECT * FROM otp WHERE code = $1;
        `, [code])).rows[0];

        if (!foundOTP) throw new AuthorizationFailed("Wrong code!", ErrorTypes.BAD_USER_INPUT);

        console.log("foundOTP:", foundOTP);

        if (addMinutes(foundOTP.sended_time, 1) < new Date()) {
            await OTPService.delete({ telegram_user_id: foundOTP.telegram_user_id });
            throw new UnauthorizedExcaption("Code expired!", ErrorTypes.BAD_USER_INPUT);
        }
        
        if (foundOTP.code === registerUserInput.code) {
            const userInfo: IUserQueue = await UsersQueueService.deleteUser(foundOTP.telegram_user_id);
            const deletedOTP = await OTPService.delete({ telegram_user_id: userInfo.telegram_user_id }); // delete otp code
            const foundUser: IUser = await UserService.findOne({
                telegram_user_id: userInfo.telegram_user_id, 
                contact: userInfo.contact
            });

            if (!foundUser) {
                const newUser: IUser = await UserService.createUser({
                    telegram_user_id: userInfo.telegram_user_id,
                    contact: userInfo.contact,
                    fullname: userInfo.fullname,
                    role: userInfo.role
                })
                return newUser;
            }
            return foundUser
        }

        throw new AuthorizationFailed("Wrong code!", ErrorTypes.BAD_USER_INPUT);
    }
}