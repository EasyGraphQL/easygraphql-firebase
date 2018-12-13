'use strict'

const fs = require('fs-extra')
const path = require('path')
const parser = require('easygraphql-parser')

const { createQuery, createMutation } = require('./queryGenerator')

function createResolver (dirPath) {
  const apiDirPath = `${dirPath}/api`
  editSchema(apiDirPath)
  const schema = fs.readFileSync(path.join(apiDirPath, 'schema.gql'), 'utf8')
  const parsedSchema = parser(schema)

  const result = []
  const queriesAndMutations = {
    Query: [],
    Mutation: []
  }
  for (const key of Object.keys(parsedSchema)) {
    if (key === 'Query') {
      parsedSchema[key].fields.forEach(query => {
        const createdQuery = createQuery(query)
        result.push(createdQuery)
        queriesAndMutations.Query.push(query.name)
      })
    } else if (key === 'Mutation') {
      parsedSchema[key].fields.forEach(mutation => {
        const createdMutation = createMutation(mutation)
        result.push(createdMutation)
        queriesAndMutations.Mutation.push(mutation.name)
      })
    }
  }

  const modulToExport = `
    module.exports = {
      Query: {
        ${queriesAndMutations.Query.join(',\n')}
      },
      Mutation: {
        ${queriesAndMutations.Mutation.join(',\n')}
      }
    }
  `
  result.push(modulToExport)

  fs.outputFileSync(`${apiDirPath}/resolvers.js`, result.join('\r\n'))
}

function editSchema (apiDirPath) {
  const schema = fs.readFileSync((apiDirPath, 'schema.gql'), 'utf8')
  const parsedSchema = parser(schema)
  const newQueries = []
  const queries = parsedSchema.Query.fields
  for (const query of queries) {
    const searchByKey = `  get${query.type}ByKey(key: ID!): ${query.type}`

    if (newQueries.indexOf(searchByKey) < 0) {
      newQueries.push(searchByKey)
    }
  }

  const data = schema.split('\n')
  const scriptPosition = data.indexOf('type Query {')
  data.splice(scriptPosition + 1, 0, `${newQueries.join('\n')}`)
  const text = data.join('\n')
  fs.outputFileSync(`${apiDirPath}/schema.gql`, text)
}

module.exports = createResolver
