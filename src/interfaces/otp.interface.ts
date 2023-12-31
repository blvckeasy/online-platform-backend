export interface ICreateOTPinput {
    telegram_user_id: string;
    fullname?: string;
    contact: string;
}

export interface IDeleteOTPinput {
    telegram_user_id: string;
}

export interface IOTP {
    id: number;
    telegram_user_id: string;
    code: number;
    sended_time: Date;
}
