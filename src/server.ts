import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { 
    ApolloServerPluginDrainHttpServer,
} from '@apollo/server/plugin/drainHttpServer'
import { makeExecutableSchema } from '@graphql-tools/schema'
import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import typeDefs from './graphql/schemas'
import resolvers from './graphql/resolvers'
import { connectDatabase } from './utils/pg';
import graphqlScalarTypes from './utils/graphql-scalar-types';
import Routes from './api/routes'
import { ConfigService } from './config/config.service';
import botBootstrap from './bot/bot';
import ErrorHandler, { ErrorTypes } from './utils/error-handler';
import { FILE } from './utils/file';
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import JWT from './utils/jwt';
import { UserActivitiesService } from './services/user-activities.service';
import { IParsedAccessToken } from './interfaces/jwt.interface';


async function bootstrap() {
    const PORT = ConfigService.get<number>("serverOptions.PORT");
    // const HOST = ConfigService.get<string>("serverOptions.HOST");
    // const PROTOCOL = ConfigService.get<string>("serverOptions.PROTOCOL");

    const app = express();
    const httpServer = http.createServer(app);
    
    const schema = makeExecutableSchema({ typeDefs, resolvers: [ graphqlScalarTypes, ...resolvers ] });
    
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql'
    })
    const wsServerCleanup = useServer({
        schema,
        onConnect: async (ctx: any) => {
            try {
                const { token } = ctx.connectionParams;
                console.log("connected:", Object.keys(ctx["extra"]["request"]));

                if (token) {
                    const user = JWT.verify(token as string);
                    // console.log(user);
                }
            } catch (error) {
            }
        },
        onDisconnect: async (ctx, code, reason) => {
            try {

                const { token } = ctx.connectionParams;
                if (token) {
                    const user = JWT.verify(token as string) as IParsedAccessToken;

                    // UserActivitiesService.connected({
                    //     user_id: user.id,
                    //     user_agent: ""
                    // })
                }
            } catch (error) {
            }
        }
    }, wsServer )

    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await wsServerCleanup.dispose()
                        }
                    }
                }
            }
        ],
    });

    await botBootstrap();
    await connectDatabase();
    await server.start();

    app.use(express.json());
    app.use(cors<cors.CorsRequest>({
        origin: "*",
    }))

    app.use('/graphql', expressMiddleware(server, {
        context: ({ req }) => ({ req }) as any,
    }));

    app.get("/", (req, res) => {
        res.send({
            'Project name': 'Easy Learn',
            version: '1.0.0^production',
            author: 'github.com/blvckeasy',
        });
    });
    
    await Routes(app);

    app.use("**", (req: Request, res: Response, next: NextFunction) => {
        res.send("404 not found");
    })

    app.use(async (error: any, req: Request, res: Response, next: NextFunction) => {
        const ERRORS = await import('./utils/errors');

        for await (const [ errorName ] of Object.entries(ERRORS)) {
            const constructorName = error.constructor.name
            if (constructorName === errorName && constructorName !== "InternalServerError") {
                return res.send({
                    error: {
                        code: error.code,
                        message: error.message,
                        constructor: error.constructor.name,
                    }
                });
            }
        }
        
        FILE.writeErrorFile(error, req);
        return res.status(500).send({
            error: {
                code: ErrorTypes.INTERNAL_SERVER_ERROR,
                message: "Internal Server Error",
                constructor: "InternalServerError",
            }
        });
    })

    console.log(PORT);

    httpServer.listen({ port: PORT });
    console.log(`🚀 Server ready at  ${ "http" }://${ "localhost" }:${ PORT }`);
}

bootstrap();