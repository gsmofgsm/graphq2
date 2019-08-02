const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    users: [User]
    user(name: String): User
    me2: User
  }

  type User {
    id: ID!
    name: String
    username: String
  }
`;

const resolvers = {
  Query: {
    me2() {
      return { id: "2", username: "@gsm" }
    },
    user(parent, args) {
      const { name } = args;
      return users.find((user) => user.name === name);
    },
    users() {
      return users;
    }
  }
};

const users = [
  {
    name: 'J.K. Rowling',
    username: '@J.K. Rowling'
  },
  {
    name: 'Michael Crichton',
    username: '@Michael Crichton'
  },
  {
    name: 'tom',
    username: '@tom'
  },
  {
    name: 'jerry',
    username: '@jerry'
  },
]

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen(4002).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
