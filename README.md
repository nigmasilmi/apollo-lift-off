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

### How to use this repo

The course will walk you step by step on how to implement the features you see in the demo app. This codebase is the starting point of your journey!

There are 2 main folders:

- `server`: The starting point of our GraphQL server.
- `client`: The starting point of our React application.

To get started:

1. Navigate to the `server` folder.
1. Run `npm install`.
1. Run `npm start`.

This will start the GraphQL API server.

In another Terminal window,

1. Navigate to the `client` folder.
1. Run `npm install`.
1. Run `npm start`.

This will open up `localhost:3000` in your web browser.

## Getting Help

For any issues or problems concerning the course content, please refer to the [Odyssey topic in our community forums](https://community.apollographql.com/tags/c/help/6/odyssey).
