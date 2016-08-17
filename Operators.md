# SQL Operators

When making queries, there are certain operators to add additional query logic that you can use:

From wikipedia:

> A WHERE clause in SQL specifies that a SQL Data Manipulation Language (DML) statement should only affect rows that meet specified criteria. The criteria are expressed in the form of predicates. WHERE clauses are not mandatory clauses of SQL DML statements, but can be used to limit the number of rows affected by a SQL DML statement or returned by a query. In brief SQL WHERE clause is used to extract only those results from a SQL statement, such as: SELECT, INSERT, UPDATE, or DELETE statement

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
