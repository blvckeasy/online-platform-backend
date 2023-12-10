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


async function bootstrap () {
    const app = express();
    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        typeDefs,
        resolvers: [graphqlScalarTypes, ...resolvers],
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await connectDatabase();
    await server.start();
    
    await Routes(app);
    
    app.use(cors<cors.CorsRequest>({
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"],
    }))

    app.use('/graphql', express.json(), expressMiddleware(server, {
        context: ({ req }) => ({ req }) as any,
    }));


    app.get("/api/helloworld", (req, res) => {
        res.send("hello world")
    })

    app.use(async (error: Error, req: Request, res: Response, next: NextFunction) => {
        console.log("Rest api error handler")
    })

    httpServer.listen({ port: 4000 });
    console.log(`🚀 Server ready at http://localhost:4000`);
}

bootstrap();