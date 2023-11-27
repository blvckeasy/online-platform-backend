import { ICreatedOTPResponse } from "../interfaces/otp.interface";
import { ICreateUserInput } from "../interfaces/user.interface";
import { OTPService } from "./otp.service";

export class AuthService {
    static async generateCode (createUserInput: ICreateUserInput): Promise<ICreatedOTPResponse> {
        const { telegram_user_id, contact, fullname } = createUserInput;
    
        return await OTPService.create({ telegram_user_id })
    }
}