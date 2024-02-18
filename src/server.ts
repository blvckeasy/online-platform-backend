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
import { FILE } from './utils/file';
import { ErrorTypes } from './utils/error-handler';
import { Server } from 'socket.io';
import JWT from './utils/jwt';
import { UserActivitiesService } from './services/user-activities.service';
import { IParsedAccessToken } from './interfaces/jwt.interface';
import { limiter } from './api/middlewares/rate-limiter'


async function bootstrap() {
    const PORT = ConfigService.get<number>("serverOptions.PORT");
    // const HOST = ConfigService.get<string>("serverOptions.HOST");
    // const PROTOCOL = ConfigService.get<string>("serverOptions.PROTOCOL");

    const app = express();
    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            credentials: false,
            allowedHeaders: "*",
            optionsSuccessStatus: 200, // For legacy browser support
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        }
    })

    const schema = makeExecutableSchema({ typeDefs, resolvers: [graphqlScalarTypes, ...resolvers] });
    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
        ],
    });

    await botBootstrap();
    await connectDatabase();
    await server.start();


    io.on('connection', async (socket) => {
        const token = socket.request.headers.token as string;
        const socketID = socket.id as string;
        const userAgent = socket.handshake.headers["user-agent"] as string;
        const IP = socket.request.connection.remoteAddress as string;
        let user: IParsedAccessToken = null;

        if (token) {
            user = JWT.verify(token) as IParsedAccessToken;
        }

        const connectedStatus = await UserActivitiesService.connected({
            socket_ID: socketID,
            IP,
            user_id: user?.id,
            user_agent: userAgent
        })
        socket.emit("connect-status", connectedStatus)

        socket.on("disconnect", async () => {
            const disconnectedStatus = await UserActivitiesService.disconnected({
                socket_ID: socketID
            })
        })
    });

    app.set('trust proxy', 1)
    app.use(limiter);
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

        for await (const [errorName] of Object.entries(ERRORS)) {
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

        // FILE.writeErrorFile(error, req);
        return res.status(500).send({
            error: {
                code: ErrorTypes.INTERNAL_SERVER_ERROR,
                message: "Internal Server Error",
                constructor: "InternalServerError",
            }
        });
    })

    httpServer.listen({ port: PORT });
    console.log(`🚀 Server ready`);
}

bootstrap().then(() => {
    for (const [key, value] of Object.entries(process.memoryUsage())) {
        console.log(`Memory usage by ${key}, ${value / 1000000}MB `)
    }
})


for (const [key, value] of Object.entries(process.memoryUsage())) {
    console.log(`Memory usage by ${key}, ${value / 1000000}MB `)
}