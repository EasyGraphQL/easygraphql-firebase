'use strict'

const inquirer = require('inquirer')
const ora = require('ora')
const fs = require('fs-extra')
const path = require('path')
const { spawn } = require('child_process')
const argv = require('minimist')(process.argv.slice(2))

const spinner = ora('Creating easygraphql-firebase 🔥🔥🔥🔥')

const createApp = require('../util/createApp')
const createApi = require('../util/createApi')
const createSchema = require('../util/createSchema')
const createResolvers = require('../util/createResolvers')
const createEnvFile = require('../util/createEnvFile')
const createTests = require('../util/createTests')
const startServer = require('../util/startServer')

const questions = []

function createProject () {
  let fileName
  let filePath

  const arg = argv._.length > 0 ? argv._[0] : false
  const apiKey = argv.apiKey ? argv.apiKey : null
  const databaseUrl = argv.databaseUrl ? argv.databaseUrl : null
  const start = !(argv.start && argv.start === 'false')
  const port = argv.p && argv.p > 999 ? argv.p : 7000

  if (arg && (arg.includes('.gql') || arg.includes('.graphql')) && fs.existsSync(arg)) {
    fileName = arg
  } else if (arg && fs.existsSync(arg)) {
    let files = fs.readdirSync(arg)
    files = files.filter(file => file.includes('.gql') || file.includes('.graphql'))
    const options = {
      type: 'list',
      name: 'schemaName',
      message: 'Schema file name',
      choices: files
    }
    questions.push(options)
    filePath = arg
  } else {
    let files = fs.readdirSync(path.resolve())
    files = files.filter(file => file.includes('.gql') || file.includes('.graphql'))
    if (files.length === 0) {
      console.log('> Error: There are no GraphQL schema in this dir! ❌')
      process.exit(1)
    }
    const options = {
      type: 'list',
      name: 'schemaName',
      message: 'Schema file name',
      choices: files
    }
    questions.push(options)
  }

  if (!apiKey) {
    questions.push({
      type: 'input',
      name: 'apiKey',
      message: 'Your Firebase api key',
      validate: (apiKey) => typeof apiKey === 'string'
    })
  }

  if (!databaseUrl) {
    questions.push({
      type: 'input',
      name: 'databaseUrl',
      message: 'Your Firebase database url',
      validate: (databaseUrl) => typeof databaseUrl === 'string'
    })
  }

  inquirer.prompt(questions).then(answers => handleResponse(answers, fileName, filePath, start, port, apiKey, databaseUrl))
}

async function handleResponse (answers, fileName, filePath, start, port, apiKey, databaseUrl) {
  let dirPath
  try {
    fileName = fileName || answers['schemaName']
    apiKey = apiKey || answers['apiKey']
    databaseUrl = databaseUrl || answers['databaseUrl']
    spinner.start()
    const dirPath = path.join(path.resolve(), 'generated')
    createApp(dirPath)
    await createApi(dirPath)
    createSchema(dirPath, fileName, filePath)
    createEnvFile(dirPath, apiKey, databaseUrl)
    createResolvers(dirPath)
    createTests(dirPath)
    spawn('standard', ['--fix'], {
      cwd: dirPath
    })
    if (start) {
      startServer(dirPath, port)
    }
    spinner.stop()
  } catch (err) {
    spinner.stop()
    console.log('> Error:', err.message)
    fs.removeSync(dirPath)
    process.exit(1)
  }
}

module.exports = createProject
