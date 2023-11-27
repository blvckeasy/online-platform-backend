export interface ICreateOTPinput {
    telegram_user_id: number;
}

export interface ICreatedOTPResponse {
    id: number;
    telegram_user_id: number;
    code: number;
    sended_time: Date;
}