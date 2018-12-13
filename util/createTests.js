'use strict'

const path = require('path')
const fs = require('fs-extra')
const templatesPath = path.join(__dirname, '..', 'templates')

function createTests (dirPath) {
  try {
    const testsDirPath = `${dirPath}/test`
    fs.ensureDirSync(testsDirPath)
    createQueryTestFile(testsDirPath)
    createMutationTestFile(testsDirPath)
  } catch (err) {
    throw err
  }
}

function createQueryTestFile (testsDirPath) {
  fs.copySync(`${templatesPath}/testFileQuery.txt`, `${testsDirPath}/queries.js`)
}

function createMutationTestFile (testsDirPath) {
  fs.copySync(`${templatesPath}/testFileMutation.txt`, `${testsDirPath}/mutation.js`)
}

module.exports = createTests
