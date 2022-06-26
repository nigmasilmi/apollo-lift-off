const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");

const mocks = {
  SpaceCat: () => ({
    id: () => "spacecat_01",
    title: () => "spacecat pioneer",
  }),
};

const server = new ApolloServer({ typeDefs, mocks });

server.listen().then(() => {
  console.log(`
    🚀  Server is running!
    🔉  Listening on port 4000
    📭  Query at https://studio.apollographql.com/dev
  `);
});
