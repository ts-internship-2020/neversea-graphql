const contextDbInstance = require("./db/contextDbInstance");
const errorHandlingMiddleware = require('./errorHandling/errorHandlingMiddleware');

module.exports = {
  contextDbInstance,
  errorHandlingMiddleware
};
