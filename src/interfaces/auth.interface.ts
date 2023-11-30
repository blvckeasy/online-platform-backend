export interface IGenerateCode {
    code: number;
    signedTime: Date;
}

export interface IAuthRegisterUserInput {
    fullname?: string;
    code: number;
}