enum EUserRole {
    ADMIN,
    STUDENT,
    TEACHER,
}

interface ICreateUserModel {
    fullname: string;
    password: string;
    telegram_user_id: number;
    contact: string;
    role: EUserRole;
}