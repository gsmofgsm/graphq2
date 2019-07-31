const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    me2: User
  }

  type User {
    id: ID!
    username: String
  }
`;

const resolvers = {
  Query: {
    me2() {
      return { id: "2", username: "@gsm" }
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen(4002).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
