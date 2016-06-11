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
