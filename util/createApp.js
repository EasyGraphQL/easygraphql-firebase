'use strict'

const path = require('path')
const fs = require('fs-extra')
const { spawnSync } = require('child_process')
const templatesPath = path.join(__dirname, '..', 'templates')

async function createApp (dirPath) {
  try {
    fs.ensureDirSync(dirPath)
    await createPackageJson(dirPath)
    createAppFile(dirPath)
    createGitIgnoreFile(dirPath)
    editPackageJson(dirPath)
  } catch (err) {
    throw err
  }
}

function createPackageJson (dirPath) {
  return new Promise(resolve => {
    resolve(spawnSync('sh', [`${path.join(__dirname, '..', 'scripts', 'createPackage.sh')}`], {
      cwd: dirPath
    }))
  })
}

function createAppFile (dirPath) {
  fs.copySync(`${templatesPath}/starterFile.txt`, `${dirPath}/App.js`)
}

function createGitIgnoreFile (dirPath) {
  fs.copySync(`${templatesPath}/starterFileGitignore.txt`, `${dirPath}/.gitignore`)
}

function editPackageJson (dirPath) {
  const data = fs.readFileSync(`${dirPath}/package.json`, 'utf8').toString().split('\n')
  const scriptPosition = data.indexOf('  "scripts": {')
  data.splice(scriptPosition + 1, 0, '    "start": "node App.js",')
  data.splice(scriptPosition + 1, 0, '    "dev": "NODE_ENV=development node App.js",')
  const text = data.join('\n')
  const updatedPackage = text.replace('    "test": "echo \\"Error: no test specified\\" && exit 1"', '    "test": "mocha"')
  fs.outputFileSync(`${dirPath}/package.json`, updatedPackage)
}

module.exports = createApp
