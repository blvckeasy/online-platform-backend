import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
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
import path from 'path';


async function bootstrap() {
    // const PORT = ConfigService.get<number>("serverOptions.PORT");
    const PORT = process.env.PORT;
    const HOST = ConfigService.get<string>("serverOptions.HOST");
    const PROTOCOL = ConfigService.get<string>("serverOptions.PROTOCOL");

    const app = express();
    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        typeDefs,
        resolvers: [graphqlScalarTypes, ...resolvers],
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await botBootstrap();
    await connectDatabase();
    await server.start();

    app.use(cors<cors.CorsRequest>({
        origin: "*",
    }))

    app.use('/thumbnail_url', express.static(path.join(process.cwd(), 'uploads', 'images')))
    app.use('/course_video', express.static(path.join(process.cwd(), 'uploads', 'videos')))

    app.use('/graphql', express.json(), expressMiddleware(server, {
        context: ({ req }) => ({ req }) as any,
    }));

    app.get("/", (req, res) => {
        res.send("working");
    })

    app.get("/api/helloworld", (req, res) => {
        res.send("hello world")
    })

    await Routes(app);

    app.use("**", (req: Request, res: Response, next: NextFunction) => {
        res.send("404 not found");
    })

    app.use(async (error: Error, req: Request, res: Response, next: NextFunction) => {
        console.log("Rest api error handler")
        console.error(error);
        res.send("something went wrong")
    })

    httpServer.listen({ port: PORT });
    console.log(`🚀 Server ready at  ${ PROTOCOL }://${ HOST }:${ PORT }`);
}

bootstrap();