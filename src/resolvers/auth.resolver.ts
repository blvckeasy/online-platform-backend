import { BaseContext } from "@apollo/server";
import { ICreateUserInput } from '../interfaces/user.interface'
import { AuthService } from "../services/auth.service";


export const authResvoler: BaseContext = {
    Query: {},
    Mutation: {
        generateCode (createUserInput: ICreateUserInput) {
            return AuthService.generateCode(createUserInput)
        }
    },
}