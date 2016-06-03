'use strict';

const fs = require('fs');

describe("Inner joins", () => {

  it("returns pets and their owners name using an inner join", () => {
    const sql = fs.readFileSync('src/joins/01-inner.sql', 'utf8');

    return psql('test/joins/01-inner.sql')
      .then(() => knex.raw(sql))
      .then(result => result.rows)
      .should.become([
        {
          id: 1,
          name: 'Fido',
          type: 'Dog',
          user_id: 1,
          user_name: 'Abe'
        },
        {
          "id": 2,
          "name": "Sparky",
          "type": "Dog",
          "user_id": 1,
          "user_name": "Abe",
        },
        {
          "id": 3,
          "name": "Muffin",
          "type": "Cat",
          "user_id": 2,
          "user_name": "Bart",
        }
      ]);
  });

});
