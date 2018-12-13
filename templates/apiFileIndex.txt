'use strict'

const path = require('path')
const fs = require('fs')

const schema = fs.readFileSync(path.join(__dirname, 'schema.gql'), 'utf8')
const resolvers = require('./resolvers')

module.exports = {
  typeDefs: schema,
  resolvers
}
