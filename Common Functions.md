### CONCAT

`SELECT * FROM authors WHERE name =CONCAT('b', 'ob');`

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
