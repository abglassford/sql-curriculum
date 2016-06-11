'use strict';
require('../support')
const fs = require('fs');

describe("Aggregations", () => {

  it("returns the sum of the price_in_cents for the order with id 1", () => {
    const userSql = fs.readFileSync('src/03-aggregations/sum.sql', 'utf8');

    return psql('test/fixtures/orders.sql')
      .then(() => knex.raw(userSql))
      .then(result => result.rows)
      .should.become([
        {
          sum: "2000"
        },
      ]);
  });

});
