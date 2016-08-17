# Intro to SQL

## Objectives

- Use the PostgreSQL REPL to manage tables in a database (DDL).
- Use the PostgreSQL REPL to manage rows in a table (DML).

## SQL

You'll use SQL (Structured Query Language) to perform 2 basic types of operations:

- Managing the _Schema_ of a database (tables, columns, relationships, constraints etc...)
- Managing the _Data_ in a database (the rows)

## How do you manage tables in a database?

In addition to managing databases, the PostgreSQL REPL can also manage tables in the default PostgreSQL cluster. To display the tables in the current connected database, run the following REPL command.

```text
\dt
```

And you should see something like this.

![](https://i.imgur.com/Ypfh2EV.png)

**NOTE:** The word relation is a synonym for a table.

To create a `movies` table in the current connected database, run the following SQL command.

```sql
CREATE TABLE movies (
  id serial,
  title text,
  duration integer,
  rating varchar(10),
  genre text,
  is_3d boolean NOT NULL,
  released_at timestamp with time zone,
  score numeric(3, 1)
);
```

**NOTE:** All SQL commands, like the one above, can be written on a single line. However, it can be useful to split up longer commands onto multiple lines.

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/223/Screen_Shot_2016-06-21_at_5.41.07_AM.png)

The above `CREATE TABLE` command is an example a multi-line SQL command. Notice how the yellow equals sign `=` of the prompt changed to a yellow open parenthesis sign `(`. This is a clue that the PostgreSQL REPL was waiting for the SQL command to provide a matching close parenthesis `)`.

To verify the table was created, display the tables in the current connected database by running the following REPL command.

```text
\dt
```

And you should see something like this.

![](https://i.imgur.com/0geGsbQ.png)

In PostgreSQL, all databases contain a `public` schema which in turn contains tables, among other things. The most important thing to note, however, is that there a `movies` table and it has an owner.

To verify the table was created with the correct columns, run the following command.

```text
\d movies
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/224/Screen_Shot_2016-06-21_at_5.41.22_AM.png)

As you can see, the `movies` table contains a handful of columns. In a relational database system, all values in the same column must be the same data type. For example, a `integer` value can't be stored in a `text` column. This strictness is one of the reasons why a relational database system like PostgreSQL can remain performant while managing a massive collection of information.

Here's an overview of the most common data types in PostgreSQL.

| Name                                 | Storage Size | Description                               | Range                          |
|--------------------------------------|--------------|-------------------------------------------|--------------------------------|
| `boolean`                            | 1 byte       | true or false                             | `t` or `f`                     |
| `integer`	                           | 4 bytes      | Typical choice for integer                | `-2147483648` to `+2147483647` |
| `numeric(precision, scale)`	         | variable     | Typical choice for decimal                | Precise	up to 131,072 digits before the decimal point and up to 16,383 digits after the decimal point |
| `timestamp with time zone`           | 8 bytes      | Date, time, and time zone                 | 4713 BC to 294276 AD           |
| `text`                               | variable     | Variable-length string, unlimited length  | N/A                            |
| `character varying(n)`, `varchar(n)` | variable     | Variable-length string, limited length    | N/A                            |
| `character(n)`, `char(n)`            | variable     | Fixed-length string, blank padded         | N/A                            |

One common data type that's missing from this table is the `serial` data type, which was used earlier for the `id` column of the `movies` table. The reason why it's missing is because the `serial` data type is not a true type. Rather, it's a notational convenience for creating a unique identifier column. When a `serial` column is declared, an `integer` column with a sequence generator and a `NOT NULL` constraint is created instead.

A **sequence generator** is a special, single-row table that's used for generating numbers in sequential order. A `serial` sequence generator starts with value of `1` and increments the value by `1` each time the generator is triggered.

To see the sequence generator for the `id` column of the `movies` table, run the following command.

```text
\d movies_id_seq
```

And you should see something like this.

![](https://i.imgur.com/MYG7YWb.png)

When an entity without an `id` value is inserted into the `movies` table, the column's sequence generator is triggered and the next value is given to the inserted entity's `id` attribute. If the entity is eventually deleted from the table, its `id` value is not reused. Therefore, each entity in the table is guaranteed to have a unique identifier forever. Almost every table you create will have an `id serial` column.

The `serial` type also applies a `NOT NULL` constraint to the column. Like JavaScript, the `NULL` value represents the absence of data. Unless a column is given a `NOT NULL` constraint, the `NULL` value is an acceptable value for any column no matter the data type. While a `serial` column is automatically given a `NOT NULL` constraint, it's wise to manually apply the constraint to `boolean` columns as well. For example, the `NOT NULL` constraint was applied to the `is_3d` column in the `movies` table.

While creating a table with the right columns is important, the structure of a table is not set in stone. For example, as a web application evolves over time, so too can its companion database tables.

To add a column to the `movies` table, run the following command.

```sql
ALTER TABLE movies ADD COLUMN plot text;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/225/Screen_Shot_2016-06-21_at_6.17.36_AM.png)

To verify the column was added correctly, run the following command.

```text
\d movies
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/226/Screen_Shot_2016-06-21_at_6.18.38_AM.png)

To rename a column in the `movies` table, run the following command.

```sql
ALTER TABLE movies RENAME COLUMN plot TO summary;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/227/Screen_Shot_2016-06-21_at_6.19.46_AM.png)

To verify the column was renamed correctly, run the following command.

```text
\d movies
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/228/Screen_Shot_2016-06-21_at_6.20.34_AM.png)

To alter the data type of a column in the `movies` table, run the following command.

```sql
ALTER TABLE movies ALTER COLUMN summary TYPE varchar(255);
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/229/Screen_Shot_2016-06-21_at_6.21.38_AM.png)

To verify the column was renamed correctly, run the following command.

```text
\d movies
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/230/Screen_Shot_2016-06-21_at_6.22.39_AM.png)

To set a `NOT NULL` constraint on a column in the `movies` table, run the following command.

```sql
ALTER TABLE movies ALTER COLUMN summary SET NOT NULL;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/235/Screen_Shot_2016-06-21_at_6.55.23_AM.png)

To verify the constraint was set correctly, run the following command.

```text
\d movies
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/236/Screen_Shot_2016-06-21_at_6.56.30_AM.png)

To drop a column in the `movies` table, run the following command.

```sql
ALTER TABLE movies DROP COLUMN summary;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/231/Screen_Shot_2016-06-21_at_6.23.27_AM.png)

To verify the column was dropped correctly, run the following command.

```text
\d movies
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/224/Screen_Shot_2016-06-21_at_5.41.22_AM.png)

To rename the `movies` table, run the following command.

```sql
ALTER TABLE movies RENAME TO films;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/232/Screen_Shot_2016-06-21_at_6.25.23_AM.png)

To verify the table was renamed correctly, run the following command.

```text
\dt
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/233/Screen_Shot_2016-06-21_at_6.26.56_AM.png)

To drop the `films` table, run the following command.

```sql
DROP TABLE films;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/234/Screen_Shot_2016-06-21_at_6.27.35_AM.png)

To verify the table was dropped, run the following command.

```text
\dt
```

And you should see something like this.

![](https://i.imgur.com/Ypfh2EV.png)

Believe it or not, but there's a ton more you can do to manage tables. See the following articles to learn more about data types in PostgreSQL.

- [PostgreSQL Documentation - Arbitrary Precision Numbers](https://www.postgresql.org/docs/current/static/datatype-numeric.html#DATATYPE-NUMERIC-DECIMAL)
- [PostgreSQL Documentation - Character Types](https://www.postgresql.org/docs/current/static/datatype-character.html)
- [PostgreSQL Documentation - Date/Time Types](https://www.postgresql.org/docs/current/static/datatype-datetime.html)
- [PostgreSQL Documentation - Integer Types](https://www.postgresql.org/docs/current/static/datatype-numeric.html#DATATYPE-INT)
- [PostgreSQL Documentation - Serial Types](https://www.postgresql.org/docs/current/static/datatype-numeric.html#DATATYPE-SERIAL)

See the following articles to learn more about column modifiers in PostgreSQL.

- [PostgreSQL Documentation - Not-Null Constraints](https://www.postgresql.org/docs/current/static/ddl-constraints.html#AEN2531)
- [PostgreSQL Documentation - Default Values](https://www.postgresql.org/docs/current/static/ddl-default.html)

And see the following articles to learn more about the SQL commands you practiced in PostgreSQL.

- [PostgreSQL Documentation - `CREATE TABLE`](https://www.postgresql.org/docs/current/static/sql-createtable.html)
- [PostgreSQL Documentation - `ALTER TABLE`](https://www.postgresql.org/docs/current/static/sql-altertable.html)
- [PostgreSQL Documentation - `DROP TABLE`](https://www.postgresql.org/docs/current/static/sql-droptable.html)

### Exercise

A **migration** is a file that contains SQL commands that are used to recreate the tables in a database on demand. In a `migration.sql` file, type out the `CREATE TABLE movies` SQL command from above. Then, add a `DROP TABLE` command at the top of the file so you can repeatedly execute the commands. Using the PostgreSQL documentation, figure how to prevent the `DROP TABLE` command from generating an error if the table doesn't exist.

To migrate the `movie_junkies_dev` database, run the following command from your shell.

```shell
psql movie_junkies_dev -f migration.sql
```

Iterate on your migration file until you can repeatedly run it without generating an error. Then, add the necessary SQL commands to migrate an `awards` table as well. Create this table with the necessary columns to support the following entities.

```text
 id | movie_id | kind  |                                 name                                 
----+----------+-------+----------------------------------------------------------------------
  1 |        1 | Oscar | Best Animated Feature Film of the Year                               
  2 |        1 | Oscar | Best Achievement in Music Written for Motion Pictures, Original Song
```

For each column, choose what you think is the most appropriate data type. When you're finished, migrate the database and use `\dt` REPL command to verify that the table was created correctly.

Finally, add an `ALTER TABLE` command to bottom of the migration file that'll add a column to the `awards` table to track whether or not the related movie received the award. In other words, the difference between being nominated and winning the award. For this column, you get to choose both its name and data type. When you're finished, migrate the database and use `\dt` REPL command to verify that the table was created correctly.

## How do you use the PostgreSQL REPL to manage rows in a table?

To insert a row into the `movies` table, run the following command.

```sql
INSERT INTO movies (title, duration, rating, genre, is_3d, released_at, score) VALUES ('Frozen', 102, 'PG', 'Animation', TRUE, '2013-11-27 00:00:00 UTC', 7.6);
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/205/Screen_Shot_2016-06-21_at_3.48.34_AM.png)

**NOTE:** The entity was automatically given a unique value for its `id` attribute.

Insert a few more rows into the `movies` table by running the following commands.

```sql
INSERT INTO movies (title, duration, rating, genre, is_3d, released_at, score) VALUES ('X-Men: Apocalypse', 144, 'PG-13', 'Action', TRUE, '2016-05-27 00:00:00 UTC', 7.4);
INSERT INTO movies (title, duration, rating, genre, is_3d, released_at, score) VALUES ('The Princess Bride', 98, 'PG', 'Adventure', FALSE, '1987-10-09 00:00:00 UTC', 8.1);
INSERT INTO movies (title, duration, rating, genre, is_3d, released_at, score) VALUES ('Pulp Fiction', 154, 'R', 'Crime', FALSE, '1994-10-14 00:00:00 UTC', 8.9);
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/206/Screen_Shot_2016-06-21_at_3.49.35_AM.png)

To select all the rows and columns from the `movies` table, run the following command.

```sql
SELECT * FROM movies;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/207/Screen_Shot_2016-06-21_at_3.51.26_AM.png)

To select all the rows with just a few columns from the `movies` table, run the following command.

```sql
SELECT id, title FROM movies;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/220/Screen_Shot_2016-06-21_at_4.22.50_AM.png)

To select a subset of rows with just a few columns from the `movies` table, run the following command.

```sql
SELECT id, title, rating FROM movies WHERE rating = 'PG';
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/219/Screen_Shot_2016-06-21_at_4.21.55_AM.png)

To select a subset of rows with just a few columns from the `movies` table, run the following command.

```sql
SELECT id, title, rating FROM movies WHERE rating <> 'PG';
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/246/Screen_Shot_2016-06-21_at_8.59.12_AM.png)

**NOTE:** The `<>` operator is part of the SQL standard. However, PostgreSQL also implements the `!=` operator as well. Both operators do the exact same thing.

To select a subset of rows with just a few columns from the `movies` table, run the following command.

```sql
SELECT id, title, is_3d FROM movies WHERE is_3d IS TRUE;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/247/Screen_Shot_2016-06-21_at_9.20.06_AM.png)

To select a subset of rows with just a few columns from the `movies` table, run the following command.

```sql
SELECT id, title, is_3d FROM movies WHERE is_3d IS FALSE;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/248/Screen_Shot_2016-06-21_at_9.20.46_AM.png)

**NOTE:** The `IS NULL` and `IS NOT NULL` operators work similarly.

To select a subset of rows with just a few columns from the `movies` table, run the following command.

```sql
SELECT id, title, score FROM movies WHERE score > 8;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/221/Screen_Shot_2016-06-21_at_4.23.30_AM.png)

To select a subset of rows with just a few columns from the `movies` table, run the following command.

```sql
SELECT id, title, score FROM movies WHERE score <= 7.5;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/249/Screen_Shot_2016-06-21_at_9.26.03_AM.png)

To select a subset of rows with just a few columns from the `movies` table, run the following command.

```sql
SELECT id, title, score FROM movies WHERE score BETWEEN 7.5 AND 8;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/250/Screen_Shot_2016-06-21_at_9.26.57_AM.png)

To select a subset of rows with just a few columns from the `movies` table, run the following command.

```sql
SELECT id, title, score, rating FROM movies WHERE score > 8 AND rating = 'PG';
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/222/Screen_Shot_2016-06-21_at_4.24.46_AM.png)

To select a subset of rows with just a few columns from the `movies` table, run the following command.

```sql
SELECT id, title, score, rating FROM movies WHERE score > 8 OR rating = 'PG';
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/237/Screen_Shot_2016-06-21_at_8.43.26_AM.png)


```SQL
SELECT id, title, genre FROM movies WHERE genre IN ('Animation', 'Crime');
```

To select a subset of rows with just a few columns from the `movies` table, run the following command.

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/251/Screen_Shot_2016-06-21_at_9.31.44_AM.png)

```sql
SELECT id, title, genre FROM movies WHERE genre LIKE 'A%';
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/242/Screen_Shot_2016-06-21_at_8.54.19_AM.png)

To select a subset of rows with just a few columns from the `movies` table, run the following command.

```sql
SELECT id, title, genre FROM movies WHERE genre LIKE '%e';
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/243/Screen_Shot_2016-06-21_at_8.55.13_AM.png)

To select a subset of rows with just a few columns from the `movies` table, run the following command.

```sql
SELECT id, title, genre FROM movies WHERE genre LIKE '%i%';
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/244/Screen_Shot_2016-06-21_at_8.56.54_AM.png)

To select a subset of rows with just a few columns from the `movies` table, run the following command.

```sql
SELECT id, title, genre FROM movies WHERE genre NOT LIKE '%i%';
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/245/Screen_Shot_2016-06-21_at_8.58.12_AM.png)

**NOTE:** `ILIKE` and `NOT ILIKE` for case-insensitive searches.

To select all the rows in a specific order with just a few columns from the `movies` table, run the following command.

```sql
SELECT id, title, score FROM movies ORDER BY score DESC;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/238/Screen_Shot_2016-06-21_at_8.44.17_AM.png)

To select all the rows in a specific order with just a few columns from the `movies` table, run the following command.

```sql
SELECT id, title, score FROM movies ORDER BY score ASC;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/239/Screen_Shot_2016-06-21_at_8.45.06_AM.png)

**NOTE:** If an `ORDER BY` clause is _not_ specified, there are no guarantees on the order of the resulting rows.

To select one row in a specific order with just a few columns from the `movies` table, run the following command.

```sql
SELECT id, title, score FROM movies ORDER BY score DESC LIMIT 1;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/241/Screen_Shot_2016-06-21_at_8.47.09_AM.png)

To select the number of rows in the `movies` table, run the following command.

```sql
SELECT COUNT(*) FROM movies;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/252/Screen_Shot_2016-06-21_at_9.36.29_AM.png)

To select the maximum column in the `movies` table, run the following command.

```sql
SELECT MAX(duration) FROM movies;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/253/Screen_Shot_2016-06-21_at_9.37.11_AM.png)

To select the minimum column in the `movies` table, run the following command.

```sql
SELECT MIN(duration) FROM movies;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/254/Screen_Shot_2016-06-21_at_9.37.44_AM.png)

To select the sum of a column in the `movies` table, run the following command.

```sql
SELECT SUM(duration) FROM movies;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/256/Screen_Shot_2016-06-21_at_9.39.39_AM.png)

To select the average of a column in the `movies` table, run the following command.

```sql
SELECT AVG(duration) FROM movies;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/255/Screen_Shot_2016-06-21_at_9.38.16_AM.png)

To update a column for a single row in the `movies` table, run the following command.

```sql
UPDATE movies SET score = 9.1 WHERE id = 2;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/214/Screen_Shot_2016-06-21_at_4.07.38_AM.png)

```sql
SELECT id, title, rating, score FROM movies ORDER BY score DESC;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/263/Screen_Shot_2016-06-21_at_3.11.32_PM.png)

To update a column for a single row in the `movies` table, run the following command.

```sql
UPDATE movies SET score = score + 0.3 WHERE rating = 'R';
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/260/Screen_Shot_2016-06-21_at_1.35.57_PM.png)

```sql
SELECT id, title, rating, score FROM movies ORDER BY score DESC;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/264/Screen_Shot_2016-06-21_at_3.12.35_PM.png)

```sql
UPDATE movies SET score = score - 1.2 WHERE rating = 'PG';
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/265/Screen_Shot_2016-06-21_at_3.13.17_PM.png)

```sql
SELECT id, title, rating, score FROM movies ORDER BY score DESC;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/267/Screen_Shot_2016-06-21_at_3.15.34_PM.png)

To delete a row in the `movies table`, run the following command.

```sql
DELETE FROM movies WHERE id = 1;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/270/Screen_Shot_2016-06-21_at_4.00.38_PM.png)

```sql
SELECT id, title, rating, score FROM movies ORDER BY score DESC;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/269/Screen_Shot_2016-06-21_at_3.17.48_PM.png)

```sql
DELETE FROM movies WHERE score > 9;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/271/Screen_Shot_2016-06-21_at_4.02.15_PM.png)

```sql
SELECT id, title, rating, score FROM movies ORDER BY score DESC;
```

And you should see something like this.

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/272/Screen_Shot_2016-06-21_at_4.14.43_PM.png)

See the following articles to learn more about the operators in PostgreSQL.

- [PostgreSQL documentation - Aggregate Functions](https://www.postgresql.org/docs/current/static/functions-aggregate.html)
- [PostgreSQL documentation - Comparison Operators](https://www.postgresql.org/docs/current/static/functions-comparison.html)
- [PostgreSQL documentation - Logical Operators](https://www.postgresql.org/docs/current/static/functions-logical.html)
- [PostgreSQL documentation - Mathematical Operators](https://www.postgresql.org/docs/current/static/functions-math.html)
- [PostgreSQL documentation - Pattern Matching](https://www.postgresql.org/docs/current/static/functions-matching.html)
- [PostgreSQL documentation - Range Functions and Operators](https://www.postgresql.org/docs/current/static/functions-range.html)
- [PostgreSQL documentation - String Operators](https://www.postgresql.org/docs/current/static/functions-string.html)

See the following articles to learn more about the SQL commands you practiced in this section.

- [PostgreSQL documentation - `DELETE`](https://www.postgresql.org/docs/current/static/sql-delete.html)
- [PostgreSQL documentation - `INSERT`](https://www.postgresql.org/docs/current/static/sql-insert.html)
- [PostgreSQL documentation - `SELECT`](https://www.postgresql.org/docs/current/static/sql-select.html)
- [PostgreSQL documentation - `UPDATE`](https://www.postgresql.org/docs/current/static/sql-update.html)

### Exercises

A **seed** file contains SQL commands that are used to recreate the rows in a table on demand. In a `seed.sql` file, type out the four `INSERT INTO movies` SQL commands from above. Then, add a `DELETE FROM movies` command at the top of the file so you can repeatedly execute the commands. Using the PostgreSQL documentation, figure how to delete all the rows of the `movies` table in one command.

To seed the `movie_junkies_dev` database, run the following command from your shell.

```shell
psql movie_junkies_dev -f seed.sql
```

Iterate on your seed file until you can repeatedly run it without generating an error. Then, add SQL commands at the bottom of the file to do the following.

- Return the `id`, `title`, and `score` of the single lowest scoring movie in the table.
- Return the `id`, `title`, and `duration` of the "X-Men: Apocalypse" and "The Princess Bride" movies.
- Return the `id`, `title`, and `released_at` all the movies ordered by from oldest to newest.
- Return the `id`, `title`, `genre`, and `score` of all of the PG movies that scored between 7.5 and 8.5
- Add a half a point to the `score` of all Crime movies.
- Subtract 2 points from the `score` of all the 3-D movies.
- Delete all movies that have the word 'en' in their `title`.

---

Recreate the following ERD and populate each table with at least 10 pieces of data:

![](https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/202/erd.png)

---

- [Intro SQL Exercise](https://github.com/gSchool/intro_sql_exercise)

---

- https://github.com/gSchool/postgres-for-js-devs
- https://github.com/gSchool/sql-practice-commands
- https://github.com/gSchool/learn-sql
- https://github.com/gSchool/sql-homework
- https://github.com/gSchool/sql-assessment

## Resources

- [PostgreSQL Documentation - Home](https://www.postgresql.org/docs/current/static/)
- [PostgreSQL Documentation - Querying a Table](https://www.postgresql.org/docs/current/static/tutorial-select.html)
- [SQL Tutorial - Home](http://www.sqltutorial.org/)
- [SQL Tutorial - SQL Cheatsheet](http://www.sqltutorial.org/wp-content/uploads/2016/04/sqlcheatsheet.pdf)
- [W3Schools - SQL Tutorial](http://www.w3schools.com/sql/default.asp)
- [http://www.postgresql.org/docs/](http://www.postgresql.org/docs/)  - This is your friend!
- [http://www.cheat-sheets.org/saved-copy/sqlcheetsheet.gif](http://www.cheat-sheets.org/saved-copy/sqlcheetsheet.gif)
- [http://www.sql-tutorial.net/SQL-Cheat-Sheet.pdf](http://www.sql-tutorial.net/SQL-Cheat-Sheet.pdf)
- [http://www.sqlcommands.net/sql+insert/](http://www.sqlcommands.net/sql+insert/)

## Slides

- [Introduction to SQL](https://docs.google.com/a/galvanize.com/presentation/d/1bgZ02fr0Z5YRIYxI9JRTtjEMdZtgRCX7vCf6dNLzeiU/edit?usp=sharing)
- [DDL and SQL](https://docs.google.com/presentation/d/1hOQERqa5UFrENm7HXJfXxElmgdBY7jssnW3Mm4RvwWw/edit#slide=id.gf38aea6c9_0_12)
