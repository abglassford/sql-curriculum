### SQL Operators and Aggregates

When making queries, there are certain operators to add additional query logic that you can use:

### WHERE

From wikipedia:

A WHERE clause in SQL specifies that a SQL Data Manipulation Language (DML) statement should only affect rows that meet specified criteria. The criteria are expressed in the form of predicates. WHERE clauses are not mandatory clauses of SQL DML statements, but can be used to limit the number of rows affected by a SQL DML statement or returned by a query. In brief SQL WHERE clause is used to extract only those results from a SQL statement, such as: SELECT, INSERT, UPDATE, or DELETE statement

### Comparison ( =, !=, <>)

`SELECT * FROM authors WHERE age =22;`

`SELECT * FROM authors WHERE age !=22;` (same as <>)

`SELECT * FROM authors WHERE age <> 22;` (same as !=)

### Concatenation - ||

`SELECT * FROM authors WHERE name = 'b'||'ob';`

### Regex (~)

`SELECT * FROM authors WHERE name ~ '^b';`

### BETWEEN

`SELECT * FROM authors WHERE age BETWEEN 20 AND 30;`

### LIKE

`SELECT * FROM authors WHERE name LIKE '%b%';`

### CONCAT

`SELECT * FROM authors WHERE name =CONCAT('b', 'ob');`

### DISTINCT

`SELECT DISTINCT name FROM authors;`

### IS NULL

`SELECT * FROM authors WHERE age IS NULL;`

### IN / NOT IN

`SELECT * FROM authors WHERE id IN (1,2,3);`

### EXISTS

`SELECT EXISTS(SELECT * from authors WHERE id=1);`

### OR

` SELECT * FROM authors WHERE name = 'bob' OR id=1;`

### AND

`SELECT * FROM authors WHERE name = 'bob' AND id=1;`

### ORDER BY

`SELECT * FROM authors ORDER BY age ASC;`

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

### Advanced Queries + Prepared Statements

From wiki:

In database management systems, a prepared statement or parameterized statement is a feature used to execute the same or similar database statements repeatedly with high efficiency. Typically used with SQL statements such as queries or updates, the prepared statement takes the form of a template into which certain constant values are substituted during each execution.

[Docs](http://www.postgresql.org/docs/9.2/static/sql-prepare.html)

```
PREPARE
  city ( varchar, point )
AS INSERT INTO
  cities ( id, city, location )
VALUES
  ( default, $1, $2 );

EXECUTE city ( 10, 'Bronx', point(13,34) );
```

### CASE

From [https://sqlschool.modeanalytics.com/intermediate/case/](https://sqlschool.modeanalytics.com/intermediate/case/)

The CASE statement is SQL’s way of handling if/then logic. The CASE statement is followed by at least one pair of WHEN and THEN statements — SQL’s equivalent of IF/THEN. It must end with the END statement. The ELSE statement is optional, and provides a way to capture values not specified in the WHEN/THEN statements. It’s easiest to understand in the context of an example:

```
SELECT name,age,
CASE WHEN age between 70 AND 79 THEN 'seventies'
WHEN age between 60 AND 69 THEN 'sixties'
WHEN age between 50 AND 59 THEN 'fifties'
WHEN age between 40 AND 49 THEN 'fourties'
WHEN age between 30 AND 39 THEN 'thirties'
WHEN age between 20 AND 29 THEN 'twenties'
ELSE 'unknown' END
AS age_in_text
FROM owners;
```

### COALESCE

From [http://www.postgresql.org/docs/9.4/static/functions-conditional.html](http://www.postgresql.org/docs/9.4/static/functions-conditional.html)

The COALESCE function returns the first of its arguments that is not null. Null is returned only if all arguments are null. It is often used to substitute a default value for null values when data is retrieved for display.

Like a CASE expression, COALESCE only evaluates the arguments that are needed to determine the result; that is, arguments to the right of the first non-null argument are not evaluated. This SQL-standard function provides capabilities similar to NVL and IFNULL, which are used in some other database systems.

`SELECT name, COALESCE(age, -1) FROM owners;`

### VIEW

From "Practical PostgreSQL":

While working with SQL, times will often arise when you would like your statements to be re-usable. This is especially the case when working with large or intricate queries. There are few things more frustrating then having to re-type a long query over and over again within psql. Furthermore, it can be highly inefficient to pass excessively large queries over a network to your PostgreSQL server for commonly executed routines.

This is where views can come in handy. Views can be thought of as stored queries, which allow you to create a database object that functions very similarly to a table, but whose contents are dynamically and directly reflective only of the rows which it is defined to select. Views are quite flexible in practice, in that they may address common, simple queries to a single table, as well as extraordinarily complicated ones which may span across several tables.

`CREATE VIEW name AS query`

`SELECT * FROM view`

`DROP VIEW name`

### EXPLAIN

[http://www.postgresql.org/docs/9.4/static/sql-explain.html](http://www.postgresql.org/docs/9.4/static/sql-explain.html)

### Assignment

[Intro SQL Exercise Part 2](https://github.com/gSchool/intro_sql_exercise)
