// import { IAuthRegisterUserInput } from "../interfaces/auth.interface";
// import { ICreatedOTPResponse } from "../interfaces/otp.interface";
// import { ICreateUserQueueInput } from "../interfaces/users-queue.interface";
// import { OTPService } from "./otp.service";
// import CustomError from '../utils/error-handler'
// import { client } from "../utils/pg";

// export class AuthService {
//     static async generateCode (createUserQueueInput: ICreateUserQueueInput): Promise<ICreatedOTPResponse> {
//         return await OTPService.create(createUserQueueInput)
//     }

//     static async register (registerUserInput: IAuthRegisterUserInput) {
//         try {
//             const foundOTP = (await client.query(`
//                 SELECT * FROM otp WHERE telegram_user_id = $1 AND sended_time + ;
//             `,)).rows[0];
//         } catch (error) {
//             throw await CustomError(error);
//         }
//     }
// }