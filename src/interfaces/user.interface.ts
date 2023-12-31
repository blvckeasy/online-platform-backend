import { EUserRole } from "../models/enums/user-role.enum";

export interface IGetUsers {
    id: number;
    contact: number;
    role: EUserRole,
}

export interface ISearchUserInput {
    id?: number;
    telegram_user_id?: string;
    contact?: string;
}

export interface ICreateUserInput {
    fullname?: string;
    telegram_user_id: string;
    contact: string;
    role: EUserRole;
}

export interface IUser {
    id: number;
    fullname?: string;
    telegram_user_id: string;
    contact: number;
    role: EUserRole;
    signed_time: Date;
}

export interface IUserResponse {
    user: IUser;
    token: {
        access_token: string;
        refresh_token: string;
    }
}

export interface IUpdateUserInput {
    fullname?: string;
    role: EUserRole;
}