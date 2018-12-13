<h1 align="center">
  <img src="https://raw.githubusercontent.com/EasyGraphQL/easygraphql-now/master/logo.png" alt="easygraphql-firebase " width="350">
  <br>
    easygraphql-firebase 
  <br>
  <br>
</h1>

`easygraphql-firebase` is global package that will create a GraphQL server connected
to your Firebase real-time database just using a GraphQL schema.

## Installation
```bash
$ npm install easygraphql-firebase -g
```

## Usage
To get started with your GraphQL-Firebase server you need to have:

+ GraphQL schema.
+ Firebase API key.
+ Firebase database url.

Create a GraphQL schema file.
```graphql
type Student {
  key: ID!
  age: Int!
  name: String!
}

type School {
  key: ID!
  location: String!
  students: Int!
  name: String!
  student: Student!
}

input StudentInput {
  age: Int!
  name: String!
}

input SchoolInput {
  location: String!
  students: Int!
  name: String!
  phone: String!
  student: StudentInput!
}

type Query {
  getStudentByUsername(name: String!): Student!
  getStudents: [Student!]!
  getSchool(name: String!): School!
  getSchools: [School!]!
}

type Mutation {
  createStudent(input: StudentInput!): Student!
  createSchool(input: SchoolInput!): School!
}
```

#### Run on your terminal

```bash
$ easygraphql-firebase
```
by default it is going to run the server automatically.

You can set flags to prevent running it automatically, set apiKey, set databaseUrl and also pass the schema name.

```bash
$ easygraphql-firebase schema.gql --apiKey=<YOUR_API_KEY> --databaseUrl=<YOUR_DATABASE_URL> --start=false
```

and select the GraphQL schema you want to use; also, it will ask for some env variables,
you can press enter and add them later.

`easygraphql-firebase` will start creating the whole project, and also it will add to the new schema
some new queries, like
```graphql
type Query {
  ....
  getUserByKey(key: ID!): User
  getSchoolByKey(key: ID!): School
}
```

also, there is going to be a folder to make tests, it is using [`easygraphql-tester`](https://github.com/EasyGraphQL/easygraphql-tester)
so, if you want to test your queries and mutations, visit the folder `test` and add on cases your own tests, add a name to identify them.

```js
const cases = [
  {
    name: 'Should get school by key',
    query: `
      {
        getSchoolByKey(key: "-LTYEa4geFv52c5rzpCS") {
          name
        }
      }
    `,
    expected: true
  }
]
```

### Result
```shell
Validate query
    ✓ Should validate the query: Should get school by key
```

## Collections

The collections that are going to be query are going to be the name of the expected type in lowercase with an `s` at the end.

E.g
If you have this query `getStudentByUsername(name: String!): Student!` the resolver is going to search on Firebase
for a collection called `students`

## Run it
To run your project visit the generated folder and run:

```bash
$ npm run start
```

## Recommendations
This a **beta** version, so the recommendations are:

+ Just set one argument to the queries.
+ Add nested fields from the input, if you want to add custom logic, edit the resolvers.
+ Test your queries / mutations.
+ If you are having a lot of records, and you are making a query that returns an array
  add a limit to it!


# License
### The MIT License

Copyright (c) 2018 EasyGraphQL

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
  