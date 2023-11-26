import { Request } from 'express';
import { BaseContext } from "@apollo/server";
import { ICreateUserInput, IUser, IUserResponse } from "./interface/user.interface";
import { client } from "../utils/pg";
import JWT from "../utils/jwt";
import { AlreadyExistsExcaption, InvalidTokenException } from '../utils/errors';
import CustomError, { ErrorTypes } from '../utils/error-handler';

class UserController {
	static async createUser (createUserInput: ICreateUserInput, context): Promise<IUserResponse> {
		try {
			console.log(createUserInput);

			const req = context.req as Request;
			const userAgent = req.headers["user-agent"] as string;
			const { fullname, telegram_user_id, contact, role } = createUserInput;

			const user: IUser = await this.findOneWithContact(contact);
			if (user) throw new AlreadyExistsExcaption("User is already exists", ErrorTypes.BAD_USER_INPUT);

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
		} catch (error) {
			console.log(typeof(error))
			console.log(error.constructor.name);

			throw CustomError(error.message, error.code, error.constructor.name);
		}
	}

	static async findOneWithID(id: number): Promise<IUser> {
		const result = await client.query(`
			SELECT * FROM USERS WHERE id = $1 LIMIT 1;
		`, [id]);
		const foundUser: IUser = result.rows[0];
		return foundUser
	}

	static async findOneWithContact(contact: string): Promise<IUser> {
		const result = await client.query(`
			SELECT * FROM USERS WHERE contact = $1 LIMIT 1;
		`, [contact]);
		const foundUser: IUser = result.rows[0];
		return foundUser
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