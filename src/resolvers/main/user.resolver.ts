import { BaseContext } from "@apollo/server";
import { ICreateUserInput, IUpdateUserInput, IUser, IUserResponse } from "../../interfaces/user.interface";
import { UserService } from "../../services/user.service";
import { Request } from "express";
import JWT from "../../utils/jwt";
import { InvalidTokenException, RequiredParamException } from "../../utils/errors";
import { ErrorTypes } from "../../utils/error-handler";


export const userResolver: BaseContext = {
	Query: {
		user: () => 'hello this is user route',
		deleteUser: async (_: any, __: any, context: any): Promise<IUser> => {
			const { token } = context.req.headers;
            if (!token) throw new RequiredParamException("Token is required!", ErrorTypes.REQUIRED_PARAM);

            const user = JWT.verify(token) as IUser;
            if (!user) throw new InvalidTokenException("Invalid token!", ErrorTypes.INVALID_TOKEN);

			return await UserService.deleteUser(user);
		}
  	},

	Mutation: {
		createUser: async (_: any, { createUserInput }: { createUserInput: ICreateUserInput }, context: any): Promise<IUserResponse> => {
			const req = context.req as Request;
			const userAgent = req.headers["user-agent"] as string;
			const newUser: IUser = await UserService.createUser(createUserInput)

			return {
				user: newUser,
				token: {
					access_token: JWT.sign({ id: newUser.id, contact: newUser.contact, userAgent }),
					refresh_token: JWT.sign({ id: newUser, userAgent }),
				}
			} as IUserResponse
		},

		updateUser: async (_: any, { updateUserInput }: { updateUserInput: IUpdateUserInput }, context: any): Promise<IUser> => {
			const { token } = context.req.headers;
            if (!token) throw new RequiredParamException("Token is requred!", ErrorTypes.INVALID_TOKEN);

            const user = JWT.verify(token) as IUser;
			const updatedUser = await UserService.updateUser(updateUserInput, user);
			
			return updatedUser;
		},
	}
};