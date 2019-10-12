"use strict";

const fs = require("fs-extra");
const path = require("path");
const parser = require("easygraphql-parser");

const { createQuery, createMutation } = require("./queryGenerator");

function createResolver(dirPath) {
  const apiDirPath = `${dirPath}/api`;
  editSchema(apiDirPath);
  const schema = fs.readFileSync(path.join(apiDirPath, "schema.gql"), "utf8");
  const parsedSchema = parser(schema);

  const result = [];
  const queriesAndMutations = {
    Query: [],
    Mutation: []
  };
  for (const key of Object.keys(parsedSchema)) {
    if (key === "Query") {
      parsedSchema[key].fields.forEach(query => {
        const createdQuery = createQuery(query);
        result.push(createdQuery);
        queriesAndMutations.Query.push(query.name);
      });
    } else if (key === "Mutation") {
      parsedSchema[key].fields.forEach(mutation => {
        const createdMutation = createMutation(mutation);
        result.push(createdMutation);
        queriesAndMutations.Mutation.push(mutation.name);
      });
    }
  }

  const modulToExport = `
    module.exports = {
      Query: {
        ${queriesAndMutations.Query.join(",\n")}
      },
      Mutation: {
        ${queriesAndMutations.Mutation.join(",\n")}
      }
    }
  `;
  result.push(modulToExport);

  fs.outputFileSync(`${apiDirPath}/resolvers.js`, result.join("\r\n"));
}

function editSchema(apiDirPath) {
  const schema = fs.readFileSync(path.join(apiDirPath, "schema.gql"), "utf8");
  const parsedSchema = parser(schema);
  const newQueries = [];
  const newMutations = [];
  const updateInputs = [];

  const queries = parsedSchema.Query.fields;
  const mutations = parsedSchema.Mutation.fields;

  for (const query of queries) {
    const searchByKey = `  get${query.type}ByKey(key: ID!): ${query.type}`;

    if (newQueries.indexOf(searchByKey) < 0) {
      newQueries.push(searchByKey);
    }
  }

  for (const mutation of mutations) {
    const { type } = mutation;

    const updateByKey = `  update${type}ByKey(input: Update${type}Input!): ${type}`;

    if (newMutations.indexOf(updateByKey) < 0) {
      newMutations.push(updateByKey);
    }

    const fields = [];
    for (const field of parsedSchema[type].fields) {
      const x = parsedSchema[field.type];
      if (field.name.toLowerCase() !== "key" && !x) {
        fields.push(`${field.name}: ${field.type}`);
      } else if (x && x.type === "EnumTypeDefinition") {
        fields.push(`${field.name}: ${field.type}`);
      }
    }

    const input = `
input Update${type}Input {
  key: ID!
  ${fields.join("\n  ")}
}
    `;

    if (updateInputs.indexOf(input) < 0) {
      updateInputs.push(input);
    }
  }

  const data = schema.split("\n");
  if (newQueries.length) {
    const queryPosition = data.indexOf("type Query {");
    data.splice(queryPosition + 1, 0, `${newQueries.join("\n")}`);
  }

  if (newMutations.length) {
    const mutationPosition = data.indexOf("type Mutation {");
    data.splice(mutationPosition + 1, 0, `${newMutations.join("\n")}`);
  }
  const text = data.join("\n");

  const fileName = `${apiDirPath}/schema.gql`;
  fs.outputFileSync(fileName, text);
  fs.appendFileSync(fileName, updateInputs.join(""));
}

module.exports = createResolver;
