import { BaseContext } from "@apollo/server";
import { ICreateUserQueueInput } from '../interfaces/users-queue.interface'
import { IAuthRegisterUserInput } from '../interfaces/auth.interface'
import { IOTP } from '../interfaces/otp.interface';
import { AuthService } from "../services/auth.service";
import { IUser, IUserResponse } from "../interfaces/user.interface";
import { Request } from "express";
import JWT from "../utils/jwt";


export const authResvoler: BaseContext = {
    Query: {},
    Mutation: {
        async generateCode (_: any, { createUserQueueInput }: { createUserQueueInput: ICreateUserQueueInput}): Promise<IOTP> {
            return await AuthService.generateCode(createUserQueueInput)
        },

        async register (_: any, { registerUserInput }: { registerUserInput: IAuthRegisterUserInput }, context: any): Promise<IUserResponse> {
            const req = context.req as Request;
			const userAgent = req.headers["user-agent"] as string;
            const newUser: IUser = await AuthService.register(registerUserInput);
            
            return {
                user: newUser,
                token: {
                    access_token: JWT.sign({ id: newUser.id, contact: newUser.contact, userAgent }),
					refresh_token: JWT.sign({ id: newUser, userAgent }),
                }
            }
        }
    },
}