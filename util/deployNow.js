'use strict'

const fs = require('fs-extra')
const { spawn } = require('child_process')
const clipboardy = require('clipboardy')
const ora = require('ora')

const spinner = ora('▲ Deploying to now!')

function deployNow (dirPath, apiKey, databaseUrl) {
  spinner.start()
  if (!dirPath) {
    throw new Error('The path cant be empty')
  }
  createNowEnvFile(dirPath, apiKey, databaseUrl)
  runDeployNow(dirPath)
}

function createNowEnvFile (dirPath, apiKey, databaseUrl) {
  const nowEnv = {
    'env': {
      'FIREBASE_API_KEY': apiKey,
      'FIREBASE_DATABASE_URL': databaseUrl
    }
  }
  fs.outputFileSync(`${dirPath}/now.json`, JSON.stringify(nowEnv))
}

function runDeployNow (dirPath) {
  const consoleProcess = spawn('now', ['-p'], {
    cwd: dirPath
  })

  let nowUrl
  consoleProcess.stdout.setEncoding('utf8')
  consoleProcess.stderr.setEncoding('utf8')
  consoleProcess.stderr.pipe(process.stdout)

  consoleProcess.stdout.on('data', (data) => {
    if (data.includes('https://')) {
      nowUrl = `${data}/graphql`
      clipboardy.writeSync(nowUrl)
    }
  })

  consoleProcess.stderr.on('data', (data) => {
    console.log(data)
  })

  consoleProcess.on('close', (code) => {
    spinner.succeed()
    console.log('> url copied on clipboard: ', nowUrl)
    console.log('> Thanks for using easygraphql 😀')
  })
}

module.exports = deployNow
