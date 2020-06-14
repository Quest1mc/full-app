const query = require('./queries');
const mutation = require('./mutations');
const { GraphQLSchema } = require('graphql');

module.exports = new GraphQLSchema({
  query,
  mutation,
});
