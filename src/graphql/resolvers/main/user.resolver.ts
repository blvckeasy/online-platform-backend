import { BaseContext } from "@apollo/server";
import { IUpdateUserInput, IUser } from "../../../interfaces/user.interface";
import { UserService } from "../../../services/user.service";
import JWT from "../../../utils/jwt";
import { InvalidTokenException, RequiredParamException } from "../../../utils/errors";
import ErrorHandler, { ErrorTypes } from "../../../utils/error-handler";


export const userResolver: BaseContext = {
	Query: {
		getMe: async (parent: any, __: any, context: any): Promise<IUser> => {
			try {
				const { token } = context.req.headers;
				if (!token) throw new RequiredParamException("Token is required!", ErrorTypes.REQUIRED_PARAM);
				
				const user = JWT.verify(token) as IUser;
				if (!user) throw new InvalidTokenException("Invalid token!", ErrorTypes.INVALID_TOKEN);
				
				const foundUser: IUser = await UserService.findOne({ id: user.id });
				return foundUser;
			} catch (error) {
				throw await ErrorHandler(error);
			}
		},
		deleteUser: async (_: any, __: any, context: any): Promise<IUser> => {
			try {
				const { token } = context.req.headers;
				if (!token) throw new RequiredParamException("Token is required!", ErrorTypes.REQUIRED_PARAM);
	
				const user = JWT.verify(token) as IUser;
				if (!user) throw new InvalidTokenException("Invalid token!", ErrorTypes.INVALID_TOKEN);
	
				return await UserService.deleteUser(user);
			} catch (error) {
				throw await ErrorHandler(error);
			}
		}
  	},

	Mutation: {
		updateUser: async (_: any, { updateUserInput }: { updateUserInput: IUpdateUserInput }, context: any): Promise<IUser> => {
			try {
				const { token } = context.req.headers;
				if (!token) throw new RequiredParamException("Token is requred!", ErrorTypes.INVALID_TOKEN);
	
				const user = JWT.verify(token) as IUser;
				const updatedUser = await UserService.updateUser(updateUserInput, user);
				
				return updatedUser;
			} catch (error) {
				throw await ErrorHandler(error);
			}
		},
	}
};