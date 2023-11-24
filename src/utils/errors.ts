export class UnauthorizedExcaption extends Error {
    public code: number = 401;
    public message: string;

    constructor(message: string, code?: number) {
        super(message);
        this.code = code
        this.message = message
    }
}

export class AlreadyExistsExcaption extends Error {
    public code: number = 400;
    public message: string;

    constructor(message: string, code?: number) {
        super(message);
        this.code = code
        this.message = message
    }
}