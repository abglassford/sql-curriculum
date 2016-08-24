## Objectives

- Explain what an index is.
- Explain why an index is useful.
- Use indexes to improve the speed of information retrieval in PostgreSQL.

## What's an index?

In a relational database system, an **index** is a special lookup table used to improve the speed of information retrieval for a specified table-column pair. An index on a table-column pair is like the index in an encyclopedia. You go to the index and follow the references to the desired rows that contain a table-column value.

For example, imagine a PostgreSQL database contains a `movies` table with an `id serial PRIMARY KEY` column. In PostgreSQL, every primary key is given an index and so, in this example, a `movies_pkey` index is automatically created for the `movie` table's primary key column.

Over time, thousands of rows are inserted into the table and, eventually, PostgreSQL receives a query to select the row from the `movies` table where its `id` is `1001`. Instead of sequentially searching the entire `movies` table, PostgreSQL can use the `movies_pkey` index to locate the desired row in fraction of the time.

```text
                                                 movies
                                     ┌────────┬────────────────────┐
                                     │   id   │       title        │
                                     ├────────┼────────────────────┤
                  ┌────────┐         │   1    │       Frozen       │
                  │   1    │         ├────────┼────────────────────┤
                  ├────────┤         │   2    │ X-Men: Apocalypse  │
                  │   2    │         ├────────┼────────────────────┤
movies_pkey       ├────────┤         │  ...   │        ...         │
┌────────┐        │  ...   │         ├────────┼────────────────────┤
│  NULL  │        ├────────┤         │  999   │  The Conjuring 2   │
├────────┤        │  999   │         ├────────┼────────────────────┤
│  1000  │───┐    └────────┘         │  1000  │    Finding Dory    │
├────────┤   │                       ├────────┼────────────────────┤
│  2000  │   │    ┌────────┐    ┌───▶│  1001  │  The 5th Element   │
├────────┤   └───▶│  1000  │    │    ├────────┼────────────────────┤
│  3000  │        ├────────┤    │    │  ...   │        ...         │
└────────┘        │  1001  │────┘    ├────────┼────────────────────┤
                  ├────────┤         │  1999  │ Batman v Superman  │
                  │  ...   │         ├────────┼────────────────────┤
                  ├────────┤         │  2000  │    The Martian     │
                  │  1999  │         ├────────┼────────────────────┤
                  └────────┘         │  2001  │     Zoolander      │
                                     ├────────┼────────────────────┤
                                     │  ...   │        ...         │
                                     └────────┴────────────────────┘
```

The diagram above is a picture of a data structure called a balance-tree (b-tree). A **data structure** is a particular way of organizing data so it can be used efficiently. Both an array and an object are two examples of a common data structures. Under the hood, PostgreSQL uses a b-tree to store the references of an index.

A **b-tree** is a self-balancing tree data structure. The best way to explain a b-tree is to [see it in action](https://www.cs.usfca.edu/~galles/visualization/BTree.html). Suffice to say that, due to its structure and self-balancing nature, a b-tree can perform very fast operations such as searching, sequential accessing, inserting, and deleting. Later in this program, you'll learn how to implement a special kind of b-tree called a binary search tree. For now, you can happily leverage the hard work of the PostgreSQL development team.

As you can see, an index doesn't contain any essential information. Therefore, it can safely be created or dropped without affecting the information it references.

## Exercise

Turn to a neighbor and explain in your own words what an index is.

## Why are indexes important?

An index is used to speed up `SELECT` commands on a table-column pair. As you'll see in a moment, a `SELECT` command for table-column pair without an index averages 10.4 ms, but with an index averages 0.7 ms. That's a significant speed up!

Unfortunately, the price you pay is a slight slow down for `INSERT` and `UPDATE` commands on the corresponding table. This is because when a row is inserted into or updated in a table with an index, a record must be inserted or updated into the underlying b-tree index as well. As a web developer, you'll have to determine if the trade-off of adding an index is worth it.

While an index can significantly speed up `SELECT` commands on the table-column pair, it should not be used for the following cases.

- Tables with few rows.
- Tables with frequent, large batch inserts or updates.
- Columns with many `NULL` values.

Additionally, an index on a number and timestamp column is generally more effective than an index on a textual column. This is especially true when querying a table for a particular word or phrase within a large amount of text.

### Exercise

Take a moment to write down your thoughts on why indexes are useful. After about 30 seconds, your instructor will cold call on the class and ask what was written down.

## How do you use indexes to improve the speed of information retrieval in PostgreSQL?

To get started, run the following shell commands.

```shell
createdb geo_dev
curl -fsSL https://git.io/voDXr | psql geo_dev
psql geo_dev
```

Then, list the `places` table.

```text
\d places
```

And you should see something like this.

```text
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

As you can see, PostgreSQL automatically creates an index for a primary key constraints. However, it's important to remember that PostgreSQL do not automatically create an index for a foreign key constraint.

To list all index tables, with their size, run the following command.

```text
\di+
```

And you should see something similar.

```text
                             List of relations
 Schema |    Name     | Type  |   Owner   | Table  |  Size   | Description
--------+-------------+-------+-----------+--------+---------+-------------
 public | places_pkey | index | ryansobol | places | 1912 kB |
(1 row)
```

If it's not already configured, turn on the timing of commands.

```text
\timing on
```

Next, count the number of rows with the `id` column.

```sql
SELECT COUNT(id) FROM places;
```

And you should see something like this.

```text
 count
-------
 86457
(1 row)

Time: 9.837 ms
```

A query without a `WHERE` clause can't be optimized. So let's fix that.

```sql
SELECT COUNT(id) FROM places WHERE parent_id = 21138;
```

And you see something like this.

```text
count
-------
  897
(1 row)

Time: 10.656 ms
```

To get get a statistically significant sample, run the query at least 7 times. On my computer, the average run time is about 10.4 ms.

Unsurprisingly, the [`CREATE INDEX`][create-index] statement creates an index. Use it to create an index for the `parent_id` column on the `places` table.

```sql
CREATE INDEX ON places (parent_id);
```

And you'll see something like this.

```text
CREATE INDEX
Time: 52.983 ms
```

Now list out the index tables.

```text
\di+
```

And you'll see something like this.

```text
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

```text
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

```text
 count
-------
 16325
(1 row)

Time: 17.076 ms
```

Run the query several times to get a statistically significant sample. On my computer, the average run time is about 16.3 ms.

Because there are two columns in the query's `WHERE` clause, a two-column index is needed. Create an index for the `country_code` and `target_type` columns of the `places` table.

```sql
CREATE INDEX ON places (country_code, target_type);
```

And you'll see something like this.

```text
CREATE INDEX
Time: 361.801 ms
```

List out the index tables.

```text
\di+
```

And you'll see something like this.

```text
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

```text
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

```text
 count
-------
     1
(1 row)

Time: 11.210 ms
```

Run the query several times to get a statistically significant sample. On my computer, the average run time is about 11.1 ms.

A **unique index** is used not only for performance, but also for data integrity. A unique index does not allow any duplicate values to be inserted. Create a unique index for the `canonical_name` column of the `places` table.

```sql
CREATE UNIQUE INDEX ON places (canonical_name);
```

And you'll see something like this.

```text
CREATE INDEX
Time: 1530.046 ms
```

List out the index tables.

```text
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

```text
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

```text
ERROR:  duplicate key value violates unique constraint "places_canonical_name_idx"
DETAIL:  Key (canonical_name)=(Seattle,Washington,United States) already exists.
Time: 0.818 ms
```

Under the hood, a unique index is identical to a unique constraint. The only difference is a unique partial index can only be declared with the `CREATE UNIQUE INDEX` command. See the PostgreSQL documentation on [Partial Indexes](https://www.postgresql.org/docs/9.5/static/indexes-partial.html) and this [Stack Overflow article](http://stackoverflow.com/questions/23542794/postgres-unique-constraint-vs-index#23665806) if you want to know more.

Drop the `places_canonical_name_idx` index table.

```sql
DROP INDEX places_canonical_name_idx;
```

And you'll see something similar.

```text
DROP INDEX
Time: 2.175 ms
```

Then, verify this query still works.

```sql
SELECT COUNT(id) FROM places WHERE canonical_name = 'Seattle,Washington,United States';
```

Drop the `places_country_code_target_type_idx` index table.

```sql
DROP INDEX places_country_code_target_type_idx;
```

And you'll see something similar.

```text
DROP INDEX
Time: 1.828 ms
```

Then, verify this query still works.

```sql
SELECT COUNT(id) FROM places WHERE country_code = 'US' AND target_type = 'City';
```

Drop the `places_parent_id_idx` index table.

```sql
DROP INDEX places_parent_id_idx;
```

And you'll see something similar.

```text
DROP INDEX
Time: 1.896 ms
```

Then, verify this query still works.

```sql
SELECT COUNT(id) FROM places WHERE parent_id = 21138;
```

## Resources

- [Pat Shaughnessy - Discovering the Computer Science Behind Postgres Indexes](http://patshaughnessy.net/2014/11/11/discovering-the-computer-science-behind-postgres-indexes)
- [PostgreSQL Documentation - `CREATE INDEX`](https://www.postgresql.org/docs/current/static/sql-createindex.html)
- [Wikipedia - B-tree](https://en.wikipedia.org/wiki/B-tree)

[create-index]: http://www.postgresql.org/docs/current/static/sql-createindex.html
