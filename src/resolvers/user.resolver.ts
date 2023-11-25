import { Request } from 'express';
import { BaseContext } from "@apollo/server";
import { ICreateUserInput, IUser, IUserResponse } from "./interface/user.interface";
import { client } from "../utils/pg";
import JWT from "../utils/jwt";

class UserController {
	static async createUser (createUserInput: ICreateUserInput, context): Promise<IUserResponse> {
		console.log(createUserInput);

		const req = context.req as Request;
		const userAgent = req.headers["user-agent"] as string;


		const { fullname, telegram_user_id, contact, role } = createUserInput;
		const result = await client.query(`
			INSERT INTO users (fullname, telegram_user_id, contact, role) VALUES ($1, $2, $3, $4) RETURNING *;
		`, [fullname, telegram_user_id, contact, role]);
		const newUser: IUser = result.rows[0];

		return {
			user: newUser,
			token: {
				access_token: JWT.sign({ id: newUser.id, contact: newUser.contact, userAgent }),
				refresh_token: JWT.sign({ id: newUser, userAgent }),
			}
		} as IUserResponse
	}
}

export const userResolver: BaseContext = {
	Query: {
		user: () => 'hello this is user route',
  	},

	Mutation: {
		createUser: async (_: any, { createUserInput }: { createUserInput: ICreateUserInput }, context: any): Promise<IUserResponse> => {
			return await UserController.createUser(createUserInput, context)
		}
	}
};