import { ICreatedOTPResponse } from "../interfaces/otp.interface";
import { ICreateUserQueueInput } from "../interfaces/users-queue.interface";
import { OTPService } from "./otp.service";

export class AuthService {
    static async generateCode (createUserQueueInput: ICreateUserQueueInput): Promise<ICreatedOTPResponse> {
        return await OTPService.create(createUserQueueInput)
    }
}