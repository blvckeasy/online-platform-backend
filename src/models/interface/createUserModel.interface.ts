import { EUserRole } from "../enums/userRole.enum";

export interface ICreateUserModel {
    fullname: string;
    telegram_user_id: number;
    contact: string;
    role?: EUserRole;
}