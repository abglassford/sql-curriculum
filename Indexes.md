# Database Indexes

## Objectives

- Describe what a database index is.
- Explain why database indexes are important.
- Create indexes in PostgreSQL.

## What's an index?

In relational databases, an **index** is a special lookup table used to improve the performance of data retrieval. When you imagine a database index, think of the index in the back of an encyclopedia. If you want to all the information on elephants, you find the subject in the index, lookup the page numbers that correspond to that subject, and then jump directly to one or more those pages.

A database index is just like that—a pointer to data that lives somewhere else. And since they're just pointers, indexes can be created or dropped without effecting the data.

## Why are indexes important?

An index helps speed up `SELECT` queries with `WHERE` clauses, but it slows down `INSERT` and `UPDATE` statements. When index data is inserted or updated, the database must write the data in two places—the relation table and the index table. As a full stack developer, you'll have to determine if the trade-off of indexing is worth it. In general, indexes should be avoided on:

- Tables with few rows.
- Tables with frequent, large batch inserts or updates.
- Columns with many `NULL` values.
- Columns with frequent updates.

Additionally, indexes on number and timestamp columns are generally more effective than indexes on textual columns, especially when searching for a particular word or phrase in a large amount of text.

## How do you create indexes in PostgreSQL?

To get started, run the following shell commands.

```bash
cd Exercises/src/geo
createdb geodb
psql geodb -f geo_dev.sql
psql geodb
```

List the `places` table.

```
\d places
```

And you should see something similar.

```
                                     Table "public.places"
     Column     |          Type          |                      Modifiers
----------------+------------------------+-----------------------------------------------------
 id             | integer                | not null default nextval('places_id_seq'::regclass)
 name           | character varying(60)  |
 canonical_name | character varying(100) |
 parent_id      | integer                |
 country_code   | character(2)           |
 target_type    | character varying(30)  |
 status         | character varying(20)  |
Indexes:
    "places_pkey" PRIMARY KEY, btree (id)
```

As you can see, PostgreSQL automatically creates indexes are for primary key constraints. It's also worth mentioning that PostgreSQL do not automatically create indexes for foreign key constraints.

List all the index tables to check the size of the index table.

```
\di+
```

And you should see something similar.

```
                             List of relations
 Schema |    Name     | Type  |   Owner   | Table  |  Size   | Description
--------+-------------+-------+-----------+--------+---------+-------------
 public | places_pkey | index | ryansobol | places | 1912 kB |
(1 row)
```

Turn on the timing of commands.

```
\timing on
```

And run the following query.

```sql
SELECT COUNT(id) FROM places;
```

You'll see something like this.

```
 count
-------
 86457
(1 row)

Time: 9.837 ms
```

This query can't be optimized because it doesn't have a `WHERE` clause.

Now, run the following query.

```sql
SELECT COUNT(id) FROM places WHERE parent_id = 21138;
```

And you see something like this.

```
count
-------
  897
(1 row)

Time: 10.656 ms
```

To get get a statistically significant sample, run the query at least 7 times. On my computer, the average run time is about 10.4 ms.

Unsurprisingly, the [`CREATE INDEX`][create-index] statement creates an index table. Use it to create an index for the `parent_id` column of the `places` table.

```sql
CREATE INDEX ON places (parent_id);
```

And you'll see something like this.

```
CREATE INDEX
Time: 52.983 ms
```

Now list out the index tables.

```
\di+
```

And you'll see something like this.

```
                                 List of relations
 Schema |         Name         | Type  |   Owner   | Table  |  Size   | Description
--------+----------------------+-------+-----------+--------+---------+-------------
 public | places_parent_id_idx | index | ryansobol | places | 1912 kB |
 public | places_pkey          | index | ryansobol | places | 1912 kB |
(2 rows)
```

Go ahead and run the same query.

```sql
SELECT COUNT(id) FROM places WHERE parent_id = 21138;
```

And you'll see something like this.

```
count
-------
  897
(1 row)

Time: 0.744 ms
```

Run the query several times to get a statistically significant sample. On my computer, the average run time is about 0.7 ms. That's a significant speed up!

Next, run the following query.

```sql
SELECT COUNT(id) FROM places WHERE country_code = 'US' AND target_type = 'City';
```

And you'll see something like this.

```
 count
-------
 16325
(1 row)

Time: 17.076 ms
```

Run the query several times to get a statistically significant sample. On my computer, the average run time is about 16.3 ms.

Because there are two columns in the query's `WHERE` clause, a two-column index table is needed. Create an index for the `country_code` and `target_type` columns of the `places` table.

```sql
CREATE INDEX ON places (country_code, target_type);
```

And you'll see something like this.

```
CREATE INDEX
Time: 361.801 ms
```

List out the index tables.

```
\di+
```

And you'll see something like this.

```
                                         List of relations
 Schema |                Name                 | Type  |   Owner   | Table  |  Size   | Description
--------+-------------------------------------+-------+-----------+--------+---------+-------------
 public | places_country_code_target_type_idx | index | ryansobol | places | 2400 kB |
 public | places_parent_id_idx                | index | ryansobol | places | 1912 kB |
 public | places_pkey                         | index | ryansobol | places | 1912 kB |
(3 rows)
```

Go ahead and run the same query.

```sql
SELECT COUNT(id) FROM places WHERE country_code = 'US' AND target_type = 'City';
```

And you'll see something like this.

```
 count
-------
 16325
(1 row)

Time: 5.049 ms
```

Run the query several times to get a statistically significant sample. On my computer, the average run time is about 4.9 ms. That's a significant speed up!

Next, run the following query.

```sql
SELECT COUNT(id) FROM places WHERE canonical_name = 'Seattle,Washington,United
 States';
```

And you'll see something like this.

```
 count
-------
     1
(1 row)

Time: 11.210 ms
```

Run the query several times to get a statistically significant sample. On my computer, the average run time is about 11.1 ms.

**Unique indexes** are used not only for performance, but also for data integrity. A unique index table does not allow any duplicate values to be inserted. Create a unique index for the `canonical_name` column of the `places` table.

```sql
CREATE UNIQUE INDEX ON places (canonical_name);
```

And you'll see something like this.

```
CREATE INDEX
Time: 1530.046 ms
```

List out the index tables.

```
\di+
```

And you'll see something like this.

```
                                         List of relations
 Schema |                Name                 | Type  |   Owner   | Table  |  Size   | Description
--------+-------------------------------------+-------+-----------+--------+---------+-------------
 public | places_canonical_name_idx           | index | ryansobol | places | 4472 kB |
 public | places_country_code_target_type_idx | index | ryansobol | places | 2400 kB |
 public | places_parent_id_idx                | index | ryansobol | places | 1912 kB |
 public | places_pkey                         | index | ryansobol | places | 1912 kB |
 ```

 Go ahead and run the same query.

```sql
SELECT COUNT(id) FROM places WHERE canonical_name = 'Seattle,Washington,United States';
```

And you'll see something like this.

```
  count
 -------
      1
 (1 row)

 Time: 0.458 ms
```

Run the query several times to get a statistically significant sample. On my computer, the average run time is about 0.5 ms. That's a significant speed up!

Now, run the following `INSERT` statement.

```sql
INSERT INTO places (canonical_name) VALUES ('Seattle,Washington,United States');
```

And you'll see something like this.

```
ERROR:  duplicate key value violates unique constraint "places_canonical_name_idx"
DETAIL:  Key (canonical_name)=(Seattle,Washington,United States) already exists.
Time: 0.818 ms
```

Drop the `places_canonical_name_idx` index table.

```sql
DROP INDEX places_canonical_name_idx;
```

And you'll see something similar.

```
DROP INDEX
Time: 2.175 ms
```

Drop the `places_country_code_target_type_idx` index table.

```sql
DROP INDEX places_country_code_target_type_idx;
```

And you'll see something similar.

```
DROP INDEX
Time: 1.828 ms
```

Drop the `places_parent_id_idx` index table.

```sql
DROP INDEX places_parent_id_idx;
```

And you'll see something similar.

```
DROP INDEX
Time: 1.896 ms
```

[create-index]: http://www.postgresql.org/docs/current/static/sql-createindex.html

## How do you know when you need indexes?

Use `explain`.

[http://www.postgresql.org/docs/9.4/static/sql-explain.html](http://www.postgresql.org/docs/9.4/static/sql-explain.html)
