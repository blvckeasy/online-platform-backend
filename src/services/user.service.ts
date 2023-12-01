import { client } from "../utils/pg";
import { AlreadyExistsExcaption, BadRequestExcaption, InternalServerError, NotFoundException } from '../utils/errors';
import ErrorHandler, { ErrorTypes } from '../utils/error-handler';
import { ICreateUserInput, ISearchUserInput, IUpdateUserInput, IUser } from '../interfaces/user.interface';


export class UserService {
	static async createUser (createUserInput: ICreateUserInput): Promise<IUser> {
		try {
			const { fullname, telegram_user_id, contact } = createUserInput;
			const user: IUser = await this.findOne({
                telegram_user_id, contact
            });
			
            if (user) throw new AlreadyExistsExcaption("User is already exists", ErrorTypes.BAD_USER_INPUT);

			const newUser: IUser = (await client.query(`
				INSERT INTO users (fullname, telegram_user_id, contact) VALUES ($1, $2, $3) RETURNING *;
			`, [fullname, telegram_user_id, contact])).rows[0];
			
            return newUser
		} catch (error) {
			throw await ErrorHandler(error);
		}
	}

    static async findOne (searchUserInput: ISearchUserInput): Promise<IUser> {
        try {
            const { id, telegram_user_id, contact } = searchUserInput;

            if (!searchUserInput) throw new InternalServerError("searchUserInput is require!", ErrorTypes.INTERNAL_SERVER_ERROR)

            const foundUser: IUser = (await client.query(`
                SELECT 
                    *
                FROM USERS 
                WHERE
                    id = CASE WHEN $1 > 0 THEN $1 ELSE -1 END OR
                    telegram_user_id = CASE WHEN $2 > 0 THEN $2 ELSE -1 END OR
                    contact = CASE WHEN length($3) > 0 THEN $3 ELSE '' END
            `, [id, telegram_user_id, contact])).rows[0];

            return foundUser;
        } catch (error) {
            throw await ErrorHandler(error);
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
            throw await ErrorHandler(error);
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
            throw await ErrorHandler(error);
        }
	}

    static async updateUser (updateUserInput: IUpdateUserInput, user: IUser): Promise<IUser> {
        try {
            const { fullname, role } = updateUserInput;
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

            return updatedUser;
        } catch (error) {
            throw await ErrorHandler(error);
        }
    }

    static async deleteUser (user: IUser): Promise<IUser> {
        try {
            const foundUser: IUser = await this.findOneWithID(user.id);
            if (!foundUser) throw new BadRequestExcaption("User not found!", ErrorTypes.BAD_REQUEST);

            const result = await client.query(`
                DELETE FROM USERS WHERE id = $1 RETURNING *;
            `, [foundUser.id])
            
            const deletedUser: IUser = result.rows[0];
            return deletedUser;
        } catch (error) {
            throw await ErrorHandler(error);
        }
    }
}