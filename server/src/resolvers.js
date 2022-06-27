// const fetch = require("node-fetch");

const resolvers = {
  Query: {
    // get all tracks, will be used to populate the homepage grid of our web client

    tracksForHome: (_, __, { dataSources }) => {
      return dataSources.trackAPI.getTracksForHome();
    },
    tracksForHomeFetch: async () => {
      const baseUrl = "https://odyssey-lift-off-rest-api.herokuapp.com";

      const res = await fetch(`${baseUrl}/tracks`);

      return res.json();
    },
    // get a single track by ID, for the track page
    track: (_, { id }, { dataSources }) => {
      return dataSources.trackAPI.getTrack(id);
    },
  },

  Track: {
    author: ({ authorId }, _, { dataSources }) => {
      return dataSources.trackAPI.getAuthor(authorId);
    },
    // using fetch instead of dataSources
    // author: async ({ authorId }, _, { dataSources }) => {
    //   const baseUrl = "https://odyssey-lift-off-rest-api.herokuapp.com";
    //   const res = await fetch(`${baseUrl}/author/${authorId}`);
    //   return res.json();
    // },
    modules: ({ id }, _, { dataSources }) => {
      return dataSources.trackAPI.getTrackModules(id);
    },
  },
};

module.exports = resolvers;
