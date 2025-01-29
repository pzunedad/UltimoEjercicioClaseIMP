import { MongoClient } from "mongodb";
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from "./schema.ts";
import { resolvers } from "./resolvers.ts";
import { GraphQLError } from "graphql";
import { ContactModel } from "./types.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");
if (!MONGO_URL) throw new GraphQLError("MONGO URL NOT EXISTS");

const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("Conectado a la base de datos");

const db = client.db("agenda");
const ContactCollection = db.collection<ContactModel>("contact");


const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
    context: async () => ({ ContactCollection }),
});

console.log(`🚀  Server ready at: ${url}`);