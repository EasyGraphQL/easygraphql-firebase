'use strict'

const EasyGraphQLTester = require('easygraphql-tester')
const fs = require('fs')
const path = require('path')

const typeDefs = fs.readFileSync(
  path.join(__dirname, '..', 'api', 'schema.gql'),
  'utf8',
)

describe('Validate query', () => {
  let tester
  before(() => {
    tester = new EasyGraphQLTester(typeDefs)
  })

  const cases = [
    {
      name: '<ADD_YOUR_CASE_NAME>',
      query: `<ADD_YOUR_CASE_QUERY`,
      expected: '<TRUE_FALSE>',
    }
  ]

  cases.forEach(({ name, query, expected }) => {
    it(`Should validate the query: ${name}`, () => tester.test(expected, query))
  })
})
