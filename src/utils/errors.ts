import { ApolloServerErrorCode } from "@apollo/server/dist/esm/errors";

interface errorStatus {
    errorCode: ApolloServerErrorCode;
    errorStatus: number;
}

export class ErrorStructure extends Error {
    public code: errorStatus;
    public message: string;

    constructor(message: string, code: errorStatus) {
        super(message);
        this.code = code
        this.message = message
    }
}

export class UnauthorizedExcaption extends ErrorStructure {}

export class AlreadyExistsExcaption extends ErrorStructure {}

export class InvalidTokenException extends ErrorStructure {}

export class NotFoundException extends ErrorStructure {}

export class RequiredParamException extends ErrorStructure {}

export class BadRequestExcaption extends ErrorStructure {}

export class AuthorizationFailed extends ErrorStructure {}