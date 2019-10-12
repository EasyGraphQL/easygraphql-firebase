"use strict";

const { spawn } = require("child_process");
const clipboardy = require("clipboardy");
const ora = require("ora");

const spinner = ora("Starting server locally ⏳");

function runLocal(dirPath, port) {
  spinner.start();
  if (!dirPath) {
    throw new Error("The path cant be empty");
  }
  startServer(dirPath, port);
}

function startServer(dirPath, port) {
  spawn("npm", ["run", "dev"], {
    cwd: dirPath
  });

  spinner.succeed();
  const localUrl = `http://localhost:${port}/graphql`;
  clipboardy.writeSync(localUrl);
  console.log("> url copied on clipboard: ", localUrl);

  process.on("SIGINT", exitHandler.bind(null, { dirPath }));
  process.on("SIGUSR1", exitHandler.bind(null, { dirPath }));
  process.on("SIGUSR2", exitHandler.bind(null, { dirPath }));
  process.on("uncaughtException", exitHandler.bind(null, { dirPath }));
}

function exitHandler(options) {
  console.log("> Thanks for using easygraphql-firebase 😀");
}

module.exports = runLocal;
