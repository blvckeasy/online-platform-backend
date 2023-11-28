import { EUserRole } from "../enums/user-role.enum";

export interface ICreateUserModel {
    fullname: string;
    telegram_user_id: number;
    contact: string;
    role?: EUserRole;
}