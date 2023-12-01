import { join } from "path"
import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from '@apollo/server/errors'
import { ErrorStructure } from "./errors";


export const ErrorTypes = {
    BAD_USER_INPUT: {
        errorCode: ApolloServerErrorCode.BAD_USER_INPUT,
        errorStatus: 400,
    },
    BAD_REQUEST: {
        errorCode: ApolloServerErrorCode.BAD_REQUEST,
        errorStatus: 400,
    },
    INVALID_TOKEN: {
        errorCode: ApolloServerErrorCode.OPERATION_RESOLUTION_FAILURE,
        errorStatus: 400
    },
    INTERNAL_SERVER_ERROR: {
        errorCode: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
        errorStatus: 500,
    },
    NOT_FOUND: {
        errorCode: ApolloServerErrorCode.OPERATION_RESOLUTION_FAILURE,
        errorStatus: 404,
    },
    REQUIRED_PARAM: {
        errorCode: ApolloServerErrorCode.BAD_REQUEST,
        errorStatus: 402
    }
}

export default async function ErrorHandler (error: ErrorStructure) {
    const errorMessage = error.message;
    const errorType = error.code;
    const errorInstance = error.constructor.name;
    const filePath = join(__dirname, "errors.ts");
    const allErrors = await import(filePath);

    const errorNames = Object.keys(allErrors);


    errorNames.forEach((name) => {
        if (name === errorInstance && name !== "InternalServerError") {
            throw new GraphQLError(errorMessage, {
                extensions: {
                    code: errorType.errorCode,
                    http: {
                        status: errorType.errorStatus
                    }
                }
            })
        }
    })

    console.error(error);
    throw new GraphQLError("Internal Server Error", {
        extensions: {
            code: 500,
            http: {
                status: ErrorTypes.INTERNAL_SERVER_ERROR
            }
        }
    })
}