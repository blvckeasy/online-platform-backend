import { EUserRole } from "../models/enums/user-role.enum";

export interface ICreateUserQueueInput {
    fullname?: string;
    telegram_user_id: number;
    contact: string;
}

export interface IUserQueue {
    id: number;
    fullname?: string;
    telegram_user_id: number;
    contact: string;
    role: EUserRole;
}