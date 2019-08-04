const { ApolloServer, gql } = require('apollo-server');
const HEADER_NAME = 'authorization';

const typeDefs = gql`
  type Query {
    users: [User]
    user(name: String): User
    me: User
  }

  type User {
    id: ID!
    name: String
    username: String
  }
`;

const authenticated = next => (root, args, context, info) => {
    if (!context.currentUser) {
        throw new Error(`Unauthenticated!`);
    }

    return next(root, args, context, info);
};

const validateRole = role => next => (root, args, context, info) => {
    if (context.currentUser.role !== role) {
        throw new Error(`Unauthorized!`);
    }

    return next(root, args, context, info);
};

const resolvers = {
  Query: {
    me: authenticated((root, args, context) => context.currentUser),
    user: authenticated(
        validateRole('EDITOR')(
          (parent, args) => {
            const { name } = args;
            return users.find((user) => user.name === name);
          }
    )),
    users() {
      return users;
    }
  }
};

const tradeTokenForUser = async (token) => {
    // Here, use the `token` argument, check it's validity, and return
    // the user only if the token is valid.
    // You can also use external auth libraries, such as jsaccounts / passport, and
    // trigger it's logic from here.

    if(token === 'admin') {
        return users[3];
    }
    if(token === 'author1') {
        return users[0];
    }
    if(token === 'author2') {
        return users[1];
    }
};

const users = [
  {
    name: 'J.K. Rowling',
    username: '@J.K. Rowling',
    role: "EDITOR"
  },
  {
    name: 'Michael Crichton',
    username: '@Michael Crichton',
    role: "EDITOR"
  },
  {
    name: 'tom',
    username: '@tom'
  },
  {
    name: 'jerry',
    username: '@jerry',
    role: "ADMIN"
  },
]

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ( {req} ) => {
        let authToken = null;
        let currentUser = null;

        try {
            authToken = req.headers[HEADER_NAME];

            if (authToken) {
                currentUser = await tradeTokenForUser(authToken);
            }
        } catch (e) {
            console.warn(`Unable to authenticate using auth token: ${authToken}`);
        }

        return {
            authToken,
            currentUser,
        };
    }
});

server.listen(4002).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
