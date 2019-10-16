"use strict";

const path = require("path");
const fs = require("fs-extra");

const templatesPath = path.join(__dirname, "..", "templates");

function createApp(dirPath) {
  try {
    const apiDirPath = `${dirPath}/api`;
    fs.ensureDirSync(apiDirPath);
    createApiIndex(apiDirPath);
  } catch (err) {
    throw err;
  }
}

function createApiIndex(apiDirPath) {
  fs.copySync(`${templatesPath}/apiFileIndex.txt`, `${apiDirPath}/index.js`);
}

module.exports = createApp;
