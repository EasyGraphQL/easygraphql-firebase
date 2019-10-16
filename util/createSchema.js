"use strict";

const path = require("path");
const fs = require("fs-extra");
const { buildSchema } = require("graphql");

function addGQLSchema(dirPath, schemaName, filePath) {
  try {
    const apiDirPath = `${dirPath}/api`;
    if (!dirPath) {
      throw new Error("The path can't be empty");
    }
    if (!schemaName) {
      throw new Error("The schema file name can't be empty");
    }

    let fileType = schemaName.split(".");
    fileType = fileType[fileType.length - 1];

    if (fileType !== "gql" && fileType !== "graphql") {
      throw new Error(
        "The file type is not valid, it mush be .gql or .graphql"
      );
    }

    filePath = filePath
      ? path.join(path.resolve(), filePath, schemaName)
      : path.join(path.resolve(), schemaName);
    validateSchema(filePath);
    copySchema(filePath, apiDirPath);
  } catch (err) {
    throw err;
  }
}

function validateSchema(filePath) {
  const schemaCode = fs.readFileSync(filePath, "utf8");
  buildSchema(schemaCode);
}

function copySchema(filePath, apiDirPath) {
  fs.copySync(filePath, `${apiDirPath}/schema.gql`);
}

module.exports = addGQLSchema;
