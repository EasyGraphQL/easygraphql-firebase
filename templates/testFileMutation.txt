'use strict'

const EasyGraphQLTester = require('easygraphql-tester')
const fs = require('fs')
const path = require('path')

const typeDefs = fs.readFileSync(
  path.join(__dirname, '..', 'api', 'schema.gql'),
  'utf8',
)

describe('Validate mutation', () => {
  let tester
  before(() => {
    tester = new EasyGraphQLTester(typeDefs)
  })

  const cases = [
    {
      name: '<ADD_YOUR_CASE_NAME>',
      mutation: `<ADD_YOUR_CASE_MUTATION`,
      expected: '<TRUE_FALSE>',
      input: {}
    }
  ]

  cases.forEach(({ name, mutation, expected }) => {
    it(`Should validate the query: ${name}`, () => tester.test(expected, mutation, input))
  })
})
