const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    spaceCats: [SpaceCat]
    "Query to get tracks array for the homepage grid"
    tracksForHome: [Track!]!
  }

  type SpaceCat {
    id: ID!
    name: String!
    age: Int
    missions: [Mission]
  }

  type Mission {
    id: ID!
    name: String!
    description: String!
  }

  "A track is a group of Modules that teaches about a specific topic"
  type Track {
    id: ID!
    "Track's title"
    title: String!

    "Track's main author"
    author: Author!

    "Track's main illustration to display in the card or page detail"
    thumbnail: String

    "Track's approximate length to complete, in minutes"
    length: Int

    "Track's number of modules"
    modulesCount: Int
  }

  type Author {
    id: ID!
    name: String!
    photo: String
  }
`;

module.exports = typeDefs;
