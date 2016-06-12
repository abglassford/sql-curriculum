'use strict';
const support = require('../support')
const fs = require('fs');

describe("Creating tables", () => {
  let statements

  before(function () {
    statements = support.getStatements('src/00-DDL/01-create-table.sql')
  })

  it("created the sports table successfully", () => {
    expect(statements.createSports, "You must write SQL for the createSports challenge").to.exist

    const showTableSql = `
      select column_name, data_type, is_nullable
      from information_schema.columns
      where table_name='sports';
    `

    return knex.raw(statements.createSports)
      .then(() => knex.raw(showTableSql))
      .then(result => result.rows)
      .should.become([
        {
          "column_name": "id",
          "data_type": "integer",
          "is_nullable": "NO",
        },
        {
          "column_name": "name",
          "data_type": "character varying",
          "is_nullable": "NO",
        },
      ]);
  });

  it("created the cars table successfully", () => {
    expect(statements.createCars, "You must write SQL for the createCars challenge").to.exist

    const showTableSql = `
      select column_name, data_type, is_nullable
      from information_schema.columns
      where table_name='cars';
    `

    return knex.raw(statements.createCars)
      .then(() => knex.raw(showTableSql))
      .then(result => result.rows)
      .should.become([
        {
          "column_name": "id",
          "data_type": "integer",
          "is_nullable": "NO",
        },
        {
          "column_name": "make",
          "data_type": "character varying",
          "is_nullable": "NO",
        },
        {
          "column_name": "model",
          "data_type": "character varying",
          "is_nullable": "NO",
        },
        {
          "column_name": "year",
          "data_type": "numeric",
          "is_nullable": "NO",
        },
      ]);
  });

});
