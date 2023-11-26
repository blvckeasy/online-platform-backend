import { BaseContext } from "@apollo/server";
import { ICreateUserInput, IUpdateUserInput, IUser, IUserResponse } from "./interface/user.interface";
import { UserService } from "../services/user.service";


export const userResolver: BaseContext = {
	Query: {
		user: () => 'hello this is user route',
  	},

	Mutation: {
		createUser: async (_: any, { createUserInput }: { createUserInput: ICreateUserInput }, context: any): Promise<IUserResponse> => {
			return await UserService.createUser(createUserInput, context)
		},

		updateUser: async (_: any, { updateUserInput }: { updateUserInput: IUpdateUserInput }, context: any): Promise<IUser> => {
			return await UserService.updateUser(updateUserInput, context);
		},
	}
};