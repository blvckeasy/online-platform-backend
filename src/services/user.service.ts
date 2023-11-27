import { Request } from 'express';
import { client } from "../utils/pg";
import JWT from "../utils/jwt";
import { AlreadyExistsExcaption, BadRequestExcaption, InvalidTokenException, NotFoundException, RequiredParamException } from '../utils/errors';
import CustomError, { ErrorTypes } from '../utils/error-handler';
import { ICreateUserInput, IUpdateUserInput, IUser, IUserResponse } from '../interfaces/user.interface';


export class UserService {
	static async createUser (createUserInput: ICreateUserInput, context): Promise<IUserResponse> {
		try {
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
            console.log(error);
			throw await CustomError(error);
		}
	}

	static async findOneWithID(id: number): Promise<IUser> {
		try {
            const result = await client.query(`
		    	SELECT * FROM USERS WHERE id = $1 LIMIT 1;
		    `, [id]);
		    const foundUser: IUser = result.rows[0];
		    return foundUser
        } catch (error) {
            throw await CustomError(error);
        }
	}

	static async findOneWithContact(contact: string): Promise<IUser> {
        try {
            const result = await client.query(`
		    	SELECT * FROM USERS WHERE contact = $1 LIMIT 1;
		    `, [contact]);
		    const foundUser: IUser = result.rows[0];
		    return foundUser
        } catch (error) {
            throw await CustomError(error);
        }
	}

    static async updateUser (updateUserInput: IUpdateUserInput, context: any): Promise<IUser> {
        try {
            const { fullname, role } = updateUserInput;
            const { token } = context.req.headers;
    
            if (!token) throw new RequiredParamException("Token is requred!", ErrorTypes.INVALID_TOKEN);

            const user = JWT.verify(token) as IUser;
            const foundUser = await this.findOneWithID(user.id) as IUser;

            if (!foundUser) throw new NotFoundException("User is not found!", ErrorTypes.NOT_FOUND);
    
            const result = await client.query(`
                UPDATE users
                SET
                    fullname = CASE WHEN length($1) > 0 THEN $1 ELSE fullname END,
                    role = CASE WHEN length($2) > 0 THEN $2::user_role ELSE role END
                WHERE
                    id = $3
                RETURNING *;
            `, [fullname, role, foundUser.id]);
    
            const updatedUser = result.rows[0] as IUser;
            console.log(updatedUser);
            return updatedUser;
        } catch (error) {
            console.log(error);
            throw await CustomError(error);
        }
    }

    static async deleteUser (context: any): Promise<IUser> {
        try {
            const { token } = context.req.headers;
            if (!token) throw new RequiredParamException("Token is required!", ErrorTypes.REQUIRED_PARAM);

            const user = JWT.verify(token) as IUser;
            if (!user) throw new InvalidTokenException("Invalid token!", ErrorTypes.INVALID_TOKEN);

            const foundUser: IUser = await this.findOneWithID(user.id);
            if (!foundUser) throw new BadRequestExcaption("User not found!", ErrorTypes.BAD_REQUEST);

            const result = await client.query(`
                DELETE FROM USERS WHERE id = $1 RETURNING *;
            `, [foundUser.id])
            
            const deletedUser: IUser = result.rows[0];
            return deletedUser;
        } catch (error) {
            throw await CustomError(error);
        }
    }
}