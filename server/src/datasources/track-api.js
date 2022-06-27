const { RESTDataSource } = require("apollo-datasource-rest");

class TrackAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://odyssey-lift-off-rest-api.herokuapp.com/";
  }

  // The RESTDataSource class provides helper methods for HTTP requests. In our case, we want to perform a GET request to the tracks endpoint.
  getTracksForHome() {
    return this.get("tracks");
  }

  getAuthor(authorId) {
    return this.get(`author/${authorId}`);
  }
}

module.exports = TrackAPI;
