import { join } from "path"
import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from '@apollo/server/errors'
// import { ErrorStructure } from "./errors";

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

export default (errorMessage, errorType, errorInstance) => {
    new Promise(async (resolve, reject) => {
        const filePath = join(__dirname, "errors.ts");
        const allErrors: Error[] = await import(filePath);    

        Object.keys(allErrors).forEach((error) => {
            if (allErrors[error].constructor.name == errorInstance) {
                throw new GraphQLError(errorMessage, {
                    extensions: {
                        code: 500,
                        http: {
                            status: ErrorTypes.INTERNAL_SERVER_ERROR
                        }
                    }
                })
            }
        })
    })

    throw new GraphQLError(errorMessage, {
        extensions: {
            code: errorType.errorCode,
            http: {
                status: errorType.errorStatus
            }
        }
    })
}

// export default async (error: any) => {
//     const { errorMessage, code: errorType } = error;
//     const errorInstance = error.constructor.name;

//     const filePath = join(__dirname, "errors.ts");
//     const allErrors: Error[] = await import(filePath);    

//     Object.keys(allErrors).forEach((error) => {
//         if (allErrors[error].constructor.name == errorInstance) {
//             throw new GraphQLError(errorMessage, {
//                 extensions: {
//                     code: 500,
//                     http: {
//                         status: ErrorTypes.INTERNAL_SERVER_ERROR
//                     }
//                 }
//             })
//         }
//     })

//     throw new GraphQLError(errorMessage, {
//         extensions: {
//             code: errorType.errorCode,
//             http: {
//                 status: errorType.errorStatus
//             }
//         }
//     })
// }


// export async function ErrorHandler (errorClass: ErrorStructure) {
//     const filePath = join(__dirname, "errors.ts");
//     const allErrors: Error[] = await import(filePath);

//     for await (const errorName of Object.keys(allErrors)) {
//         if (errorClass instanceof allErrors[errorName]) {
//             throw new GraphQLError(errorClass.message, {
//                 extensions: {
//                     code: errorClass.code.errorCode,
//                     http: {
//                         status: errorClass.code.errorStatus,
//                     }
//                 }
//             })
//         }
//     }

//     throw new GraphQLError("Internal server error", {
//         extensions: {
//             code: 500,
//             http: {
//                 status: 500,
//             }
//         }
//     })
// }