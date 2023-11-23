import { ApolloServer, BaseContext } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express';
import http from 'http';
import cors from 'cors';
import typeDefs from './schemas'
import resolvers from './resolvers'

async function bootstrap () {
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