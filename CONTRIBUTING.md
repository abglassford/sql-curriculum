# Contributor Guide (mainly for instructors)

Clone, cd into Exercises, `npm install` and then run `npm test`

While you are writing tests, run with `DEBUG=true npm test` in order to see if there are any errors in your seed files

Add fixtures files to `test/fixtures`

## Adding solutions

Write the tests in master, and add solutions there so you know the tests _can_ pass.

Cut the solutions out and put them in some scratch file.

Commit to master.

Check out solutions and run `git pull --rebase origin solutions` to make sure you are up-to-date.

`git rebase master` (gets the tests from master to test, without messing up previous solutions)

Paste your solutions, make sure they pass with `npm test` and commit.

`git push origin solutions --force-with-lease`

## Adding multiple SQL statements in one file

The test harness makes it easy to add multiple SQL statements in one file, as long as that the sql file follows this format:

```sql
/* Exercise selectAll

some description here...
*/

select * from users;

/* Exercise selectSome

some other description here...
*/

select name from users;
```

Notice how it has:

- A line that starts with `/* Exercise <key>`
- Closing comment markers `*/`
- SQL is written after that comment

In your test, do this:

```js
'use strict';
const support = require('../support')

describe("Creating tables", () => {
  let statements

  before(function () {
    statements = support.getStatements('src/your/file.sql')
  })

  it("selects all from users", () => {
    // write a test with statements.selectAll
    // ...
  });

  it("selects limited columns from users", () => {
    // write a test with statements.selectSome
  });

});

```

Look through existing tests for examples of this.
