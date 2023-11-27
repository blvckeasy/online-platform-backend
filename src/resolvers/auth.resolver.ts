import { BaseContext } from "@apollo/server";
import { ICreateUserQueueInput } from '../interfaces/users-queue.interface'
import { IAuthRegisterUserInput } from '../interfaces/auth.interface'
import { IOTP } from '../interfaces/otp.interface';
import { AuthService } from "../services/auth.service";


export const authResvoler: BaseContext = {
    Query: {},
    Mutation: {
        async generateCode (_: any, { createUserQueueInput }: { createUserQueueInput: ICreateUserQueueInput}): Promise<IOTP> {
            return await AuthService.generateCode(createUserQueueInput)
        },

        async register (_: any, { registerUserInput }: { registerUserInput: IAuthRegisterUserInput }) {
            return await AuthService.register(registerUserInput);
        }
    },
}