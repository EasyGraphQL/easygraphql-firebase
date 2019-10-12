"use strict";

const fs = require("fs-extra");

function createEnv(folderPath, apiKey, databaseUrl) {
  try {
    fs.ensureDirSync(folderPath);
    createEnvFile(folderPath, apiKey, databaseUrl);
  } catch (err) {
    throw err;
  }
}

function createEnvFile(folderPath, apiKey, databaseUrl) {
  const result = `FIREBASE_API_KEY="${apiKey}"
FIREBASE_DATABASE_URL="${databaseUrl}"
  `;
  fs.outputFileSync(`${folderPath}/development.env`, result);
}

module.exports = createEnv;
