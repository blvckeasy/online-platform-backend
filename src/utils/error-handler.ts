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
    }
}

export default async (error: ErrorStructure) => {
    const errorMessage = error.message;
    const errorType = error.code;
    const errorInstance = error.constructor.name;

    throw new GraphQLError(errorMessage, {
        extensions: {
            code: errorType.errorCode,
            http: {
                status: errorType.errorStatus
            }
        }
    })
}