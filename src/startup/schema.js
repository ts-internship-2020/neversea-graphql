const { makeExecutableSchema } = require('apollo-server-koa')
const merge = require('lodash.merge');

const rootTypeDefs = require('../features/common/rootSchema');
const paginationTypeDefs = require('../features/common/paginationSchema');

const userTypeDefs = require('../features/user/schema');
const userResolvers = require('../features/user/resolvers');

const conferenceTypeDefs = require('../features/conference/schema');
const conferenceResolvers = require('../features/conference/resolvers');


const typeDefs = [rootTypeDefs, paginationTypeDefs, userTypeDefs, conferenceTypeDefs]
const resolvers = merge(userResolvers, conferenceResolvers)

module.exports = makeExecutableSchema({ typeDefs, resolvers });
module.exports.tests = { typeDefs, resolvers }
