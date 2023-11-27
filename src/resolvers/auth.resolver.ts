import { BaseContext } from "@apollo/server";
import { ICreateUserQueueInput } from '../interfaces/users-queue.interface'
import { AuthService } from "../services/auth.service";


export const authResvoler: BaseContext = {
    Query: {},
    Mutation: {
        async generateCode (_: any, { createUserQueueInput }: { createUserQueueInput: ICreateUserQueueInput}) {
            console.log(createUserQueueInput);
            return await AuthService.generateCode(createUserQueueInput)
        }
    },
}