import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express';
import http from 'http';
import cors from 'cors';
import typeDefs from './schemas'
import resolvers from './resolvers'
import { connectDatabase } from './utils/pg';
import graphqlScalarTypes from './utils/graphql-scalar-types';
import { GraphQLUpload, graphqlUploadExpress } from 'graphql-upload-ts'


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


    app.use(graphqlUploadExpress())
    app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(server, {
        context: ({ req }) => ({ req }) as any,
    }));
    
    app.get("/api/helloworld", (req, res) => {
        res.send("hello world")
    })

    httpServer.listen({ port: 4000 });
    console.log(`🚀 Server ready at http://localhost:4000`);
}

bootstrap();