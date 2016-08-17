### Aggregate Functions

Aggregate functions are used to compute against a "returned column of numeric data" from your SELECT statement. They basically summarize the results of a particular column of selected data. We are covering these here since they are required by the next topic, "GROUP BY". Although they are required for the "GROUP BY" clause, these functions can be used without the "GROUP BY" clause. For example:

`SELECT SUM(age) FROM authors`;

`SELECT COUNT(*) FROM authors`;

`SELECT AVG(age) FROM authors`;

`SELECT MAX(age) FROM authors`;

`SELECT MIN(age) FROM authors`;

`SELECT SUM(age) FROM authors`;

### Group By

The GROUP BY clause will gather all of the rows together that contain data in the specified column(s) and will allow aggregate functions to be performed on the one or more columns. This can best be explained by an example:

`SELECT count(age) FROM owners GROUP BY(age);`

### Having

The HAVING clause allows you to specify conditions on the rows for each group - in other words, which rows should be selected will be based on the conditions you specify. The HAVING clause should follow the GROUP BY clause if you are going to use it.

`SELECT count(age) FROM owners GROUP BY(age) HAVING age>30`

### Resources

[http://www.postgresql.org/docs/9.4/static/functions-aggregate.html](http://www.postgresql.org/docs/9.4/static/functions-aggregate.html)
