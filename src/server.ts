import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express';
import http from 'http';
import cors from 'cors';

async function bootstrap () {
    const typeDefs = `#graphql
    type Query {
        hello: String
    }
    `;

    const resolvers = {
    Query: {
        hello: () => 'world',
    },
    };

    const app = express();
    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();

    app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(server));

    app.get("/api/helloworld", (req, res) => {
        res.send("hello world")
    })

    httpServer.listen({ port: 4000 });
    console.log(`🚀 Server ready at http://localhost:4000`);
}

bootstrap();