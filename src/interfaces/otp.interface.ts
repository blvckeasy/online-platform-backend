export interface ICreateOTPinput {
    telegram_user_id: number;
    fullname?: string;
    contact: string;
}

export interface IDeleteOTPinput {
    telegram_user_id: number;
}

export interface IOTP {
    id: number;
    telegram_user_id: number;
    code: number;
    sended_time: Date;
}
