# Odyssey Lift-off I: Basics

Welcome to the companion app of Odyssey Lift-off I! You can [find the course lessons and instructions on Odyssey](https://odyssey.apollographql.com/lift-off-part1), Apollo's learning platform.

You can [preview the completed demo app here](https://lift-off-client-demo.netlify.app/).

## Learner notes

# The GraphQL Schema

- is a contract between the server and the client
- defines waht a GraphQL API can and can't do and how clients can request or change data
- is an abstraction layer that provides flexibility to consumers while hiding back-end implementation details
- at its heart is a collection of object types that contain fields and each field has a type on its own, the syntax to do so corresponds to the Schema Definition Language

## Schema Definition Language (SDL)

- Declare a type using the type keyword, followed by the name of the type (PascalCase is recommended). then opening brackets to hold its contained fields:

```
type SpaceCat {
    # Field
}
```

- Fields are declared by their name (camelCase), a colon, and the type of the field (scalar or object)

```
type SpaceCat {
  age: Int
  missions: [Mission] // list of objects of type Mission
}
```

- Non nullable fields are indicated by a ! after its type

## Document with descriptions

- A description is a comment wrapped by double quotation marks

```
"I'm a regular description"

"""
I'm a block description
with a line break
"""
```

## Building the schema

- packages needed: apollo-server (spec complaint graphQL server utilities) and graphql (parsing and validating graphQL queries)

- npm i apollo-server graphql

- gql is a tag template literal used to wrap graphql strings

### The Query type

- is an approximate to route/handler in Rest API's

- The fields of this type are entry points into the rest of our schema. These are the top-level fields that our client can query for.

## Apollo Server

- should recieve an incoming GraphQL query from our client
- Validate that query against our schema
- Populate the queried schema fields with mocked data
- Return the populated fields as a response

in index.js:

```
const {ApolloServer} = require('apollo-server');
const typeDefs = require('./schema');

const server = new ApolloServer({typeDefs});

server.listen().then(() => {
  console.log(`
    🚀  Server is running!
    🔉  Listening on port 4000
    📭  Query at https://studio.apollographql.com/dev
  `);
});


```

- server up and running but is not connected to any data sources yet

### Mocked data

- to enable basic mocked data, we could provide mocks:true to the ApolloServer constructor, like so:

```
const server = new ApolloServer({
  typeDefs,
  mocks: true
});
```

- This instructs Apollo Server to populate every queried schema field with a placeholder value (such as Hello World for String fields).

- To serve mocked data that's closer to reality, we'll pass an object to the mocks property instead of just true.

## Apollo Studio Explorer

- https://studio.apollographql.com/dev

# Apollo Client 3

## initialization

- npm install graphql @apollo/client
- graphql provides the core logic for parsing GraphQL queries.
- @apollo/client contains pretty much everything we need to build our client, including an in-memory cache, local state management, and error handling

in index.js

```
import { ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
// The first is the uri option, which we use to specify the location of our GraphQL server.
//  every instance of ApolloClient uses an in-memory cache. This enables it to store and reuse query results so it doesn't have to make as many network requests. This makes our app's user experience feel much snappier.

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
});

```

## Provider

- The ApolloProvider component uses React's Context API to make a configured Apollo Client instance available throughout a React component tree. To use it, we wrap our app's top-level components in the ApolloProvider component and pass it our client instance as a prop:

```
ReactDOM.render(
  <ApolloProvider client={client}>
    <GlobalStyles />
    <Pages />
  </ApolloProvider>,
  document.getElementById('root')
);

```

## Querying from a component

```
import {gql} from '@apollo/client';

/** TRACKS query to retrieve all tracks */
export const TRACKS = gql`
  query getTracks {
    tracksForHome {
      id
      title
      thumbnail
      length
      modulesCount
      author {
        name
        photo
      }
    }
  }
`;
```
