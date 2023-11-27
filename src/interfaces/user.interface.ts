import { EUserRole } from "../models/enums/userRole.enum";

export interface IGetUsers {
    id: number;
    contact: number;
    role: EUserRole,
}

export interface ICreateUserInput {
    fullname?: string;
    telegram_user_id: number;
    contact: string;
    role: EUserRole;
}

export interface IUser {
    id: number;
    fullname?: string;
    telegram_user_id: number;
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