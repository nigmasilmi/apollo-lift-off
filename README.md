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

## useQuery

- The useQuery React hook is the primary API for executing queries in an Apollo application. We run a query within a React component by calling useQuery and passing it our GraphQL query string.

```
const {loading, error, data} = useQuery(TRACKS);
```

# Lift-off II: Resolvers

[Lift-off II: Resolvers](https://www.apollographql.com/tutorials/lift-off-part2)

## The GraphQL request journey

1. Client shapes the query as a string
2. Client sends HTTP POST or GET request
3. Server extracts the query string
4. Server parses and transforms the string in a Abstract Syntax Tree (AST) Document
5. Server validates the query against the type and fields in the schema
6. If anything is off, the server throws an error and sends it right back to the app
7. For each field in the query, the server invokes that fiel´s resolver function
8. A resolver function populates the field with the correct data from the correct source, such as a database or a REST API
9. The data then is assembled into a JSON object
10. The JSON object is attached to the response's body data and returns it to the client

## Apollo RestDataSource

- The interesta data is accessed through a REST API
- GraphQL server can access that REST API
- It could call the API directly using fetch, or we can use a handy helper class called a DataSource. This class takes care of a few challenges and limitations that come with the direct approach.
- With an axios or node-fetch call, accessing the tracks and then the authors would result in a n+1 number of calls
- To solve these problems, we need something specifically designed for GraphQL, that will efficiently handle resource caching and deduplication for our REST API calls.
- And because it's a very common task to fetch data from REST when building a GraphQL API, Apollo provides a dedicated DataSource class for just that: the RESTDataSource.

## implement RESTDataSource

- npm install apollo-datasource-rest
- create a folder datasources / track-api.js
- const {RESTDataSource} = require('apollo-datasource-rest');
- declare the class and export it
- add constructor body
- create method to retrieve tracks and other for getAuthor

## Resolvers

- Resolvers are functions
- Have the same name as the field that it populates data for
- Can fetch data from any data source
- Transforms the data into the shape the client requires

### implementing resolvers

- create a file for them resolvers.js
- create an object resolvers and export it
- the resolvers object's keys will correspond to our schema types and fields
- Add a Query property to the object
- for the Query property value will be the resolver functions

- e.g: tracksForHome field:

```
const resolvers = {
  Query:{
    tracksForHome: () =>{}
  }
}
```

### How does resolvers interact with the data source?

- it receives the necessary data through parameters

```
tracksForHome: (parent, args, context, info) => {},
```

- parent: is the value of the resolver for this field's parent
- args: is an object that contains all GraphQL arguments that were provided for the field by the GraphQL operation, example the id argument in the client query
- context: object shared across all resolvers that are executing for a particular operation. The resolver needs this context argument to share state, like authentication information, a database connection, the data sources(in our case the RESTDataSource).
- info: contains information about the operation's executionstate, including the field name, the path to the field from root, and more.

### Using the context argument

- We need the context, which is the third parameter, to access our data sources.
- We don't need the first two parameters, so as a convention, we'll name them with underscores
- For the context, we'll destructure it to access its child object dataSources. And we can omit the fourth parameter, info, as we won't use it.

```
const resolvers = {
  Query: {
    // get all tracks, will be used to populate the homepage grid of our web client
    tracksForHome: (_, __, {dataSources}) => {}
  }
};
```

- From our dataSources object, we'll gain access to our and its getTracksforHome method
- Add another resolver to track the author field, the name will be Track because it would be related to the track type

```
const resolvers = {
  Query: {
    // ...
  },
  Track: {
    author: (parent, args, context, info) => {}
  }
};
```

- We'll get this value from the parent argument passed to the resolver. The parent argument contains data returned by our tracksForHome resolver, and because tracksForHome returns a list, Apollo Server iterates through that list and calls the author resolver once for each track. It passes the current track as the value of parent, enabling us to extract the authorId.

## Wiring up resolvers and data sources

- import resolvers in the Apollo server entry point
- add as option in the constructor

```
const server = new ApolloServer({
  typeDefs,
  resolvers
});

```

- import the TrackAPI class ( the data source needed)
- add dataSources as a function inside the constructor options, return the instance of the data source

```
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      trackAPI: new TrackAPI()
    };
  }
});

```

- the dataSources key allows to access the RestDataSource API available to all resolvers from their context parameter

# Lift-off III: Arguments

[Lift-off III: Arguments](https://www.apollographql.com/tutorials/lift-off-part3)

## GraphQL arguments

- value provided for a specific field in a query
- the schema must define these arguments and types when needed
- the resolvers can use those arguments to retrieve specific objects, filter in a set or transform field's returned value
- To define an argument for a field in our schema, we add parentheses after the field name. Inside, we write the name of the argument followed by a colon, then the type of that argument, like String or Int. If we have more than one argument, we can separate them with commas.

## To implement new added arguments

1. update the schema (see commit ec61db6a)
2. update data source

```
 getTrack(trackId) {
    return this.get(`track/${trackId}`);
  }
```

3. update the resolvers

## Resolvers with arguments

- the required arguments will come from the query itself
- the schema must have defined those arguments in the specific query
- we can access those arguments in the resolver's args parameter

```
 track: (_, { id }, { dataSources }) => {
      return dataSources.trackAPI.getTrack(id);
    },
```

## Resolver chains

- There is a common pattern that needs to retrieve another data with pieces of information that comes from another query, most of the cases, from the parent query that is the preceding one of the more specific. Yes it is confusing, [Watch this video](https://www.apollographql.com/tutorials/lift-off-part3/resolver-chains)

- And remember the first parameter in a resolver-- the parent? parent refers to the returned data of the preceding resolver function in the chain!

* A resolver function populates the data for a field in the schema. The function has 4 parameters. The first, parent, contains the returned dta of the previous function in the resolver chain. The second, args, is an object that contains all the arguments provided to the field. We use the third parameter, context, to access data sources such as a database or REST API. Finally, the fourth parameter, info, contains informational propertioes about the operation state.

## check useQuery in track.js

# Lift-off IV: Mutations

[Lift-off IV: Mutations](https://www.apollographql.com/tutorials/lift-off-part4)
