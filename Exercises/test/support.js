'use strict';

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const spawn = require('child_process').spawn;
const connection = require('knex');
const fs = require('fs');

chai.should();
chai.use(chaiAsPromised);

global.chaiAsPromised = chaiAsPromised;
global.expect = chai.expect;
global.dbName = 'galvanize-sql-curriculum-tests';
global.psql = psql
const dbConfig = {
  client: 'pg',
  connection: `postgres://localhost/${dbName}`
};

/*
  Before each `it` function runs (each "example") execute these steps in this order:

  - if the database exists, drop it using the `dropdb` shell command
  - create a new database using the `createdb` shell command
  - create a global `knex` variable that is connected to that database
*/
beforeEach(() => {
  return resetDb().then(() => global.knex = connection(dbConfig))
});

// After each example, destroy the knex connection pool, so that future tests can reconnect
afterEach(() => knex.destroy());

function psql(filename) {
  return runCommand('psql', [dbName, '-f', filename])
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args);
    process.stdout.setEncoding('utf8');
    process.stdout.on('data', debug);
    process.stderr.setEncoding('utf8');
    process.stderr.on('data', debug);
    process.on('close', resolve);
    process.on('error', reject);
  })
}

function resetDb() {
  return runCommand('dropdb', ['--if-exists', dbName])
    .then(() => runCommand('createdb', [dbName]));
}

function debug(msg) {
  if (process.env.DEBUG) {
    console.log(msg);
  }
}

function everyIndexOf(string, element) {
  let indices = [];
  let idx = string.indexOf(element);
  while (idx != -1) {
    indices.push(idx);
    idx = string.indexOf(element, idx + 1);
  }
  return indices
}

function getSegments(string, indices) {
  let result = []
  for (var i = 0; i < indices.length; i++) {
    result.push(string.substring(indices[i], indices[i + 1] || string.length - 1))
  }
  return result
}

exports.getStatements = function (filename) {
  const sql = fs.readFileSync(filename, 'utf8');
  let indices = everyIndexOf(sql, '/* Exercise');
  return getSegments(sql, indices)
}
