## Objectives

- Explain the difference between data and information.
- Explain what an entity is.
- Diagram how a server-side web applications manage information.
- Explain what a relational database system is.
- Explain why a relational database system so useful.
- Explain what SQL is.
- Explain what PostgreSQL is.
- Install PostgreSQL.
- Start PostgreSQL.
- Use the PostgreSQL command line tools to manage databases in a PostgreSQL cluster.
- Use the PostgreSQL REPL to manage databases in a PostgreSQL cluster.

## Prework

<iframe src="https://player.vimeo.com/video/142036155" width="500" height="375" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

## What's the difference between data and information?

Before you can become fluent with a database system like PostgreSQL, you first need to become fluent with the difference between data and information. Simply put, **data** are facts. Here are some examples of data, represented in JavaScript.

```javascript
1;
'Frozen';
102;
'PG';
'Animation';
true;
new Date('2013-11-27 00:00:00 UTC');
7.6;
```

On the other hand, **information** is facts about something or someone. In other words, information is data with context. Here's an example of information about a movie, represented in JavaScript.

```javascript
const movie = {
  id: 1,
  title: 'Frozen',
  duration: 102,
  rating: 'PG',
  genre: 'Animation',
  is3D: true,
  releasedAt: new Date('2013-11-27 00:00:00 UTC'),
  score: 7.6
};
```

**NOTE:** When working with a date, always include a time with a [timezone](https://en.wikipedia.org/wiki/Time_zone#/media/File:Standard_World_Time_Zones.png). For example, if it's March 31st for a person in the U.S.A., it's April 1st for a person in China.

### Exercise

Take a minute to write down how you'd explain the difference between data and information to a friend. Then, turn to a neighbor and share what you wrote.

## What's an entity?

In the above example, the `movie` object is called an entity. An **entity** is an object that represents a person, place, or thing. As you can see from the table below, this `movie` entity has a handful of attributes. An **attribute** is a piece of information that describes an entity.

| `id` | `title`    | `duration` | `rating` | `genre`       | `is_3d`     | `released_at`                         | `score` |
|------|------------|------------|----------|---------------|-------------|---------------------------------------|---------|
| `1`  | `'Frozen'` | `102`      | `'PG'`   | `'Animation'` | `true`      | `new Date('2013-11-27 00:00:00 UTC')` | `7.6`   |

**NOTE:** In table form, attribute names are often displayed in snakecase because unquoted identifiers like `releasted_at` are case insensitive in PostgreSQL.

### Exercise

Turn to a neighbor and consider how you'd describe a `pet` entity. Think of at least five pieces of information that are essential for being a pet.

Using this information, create a JavaScript object that represents one instance of a `pet` entity. Then, create a table, like the one above, to represent the same `pet` entity.

## How do server-side web applications manage information?

Imagine you're building a web application for movie fanatics called Movie Junkies. The product development team has determined that a true movie fanatic must be able to create a `movie` entity using the web app. After all, a user can't retrieve information that doesn't exist. Therefore, your first job will be to build a server-side web application that can handle the following RESTful HTTP request.

```shell
http POST moviejunkies.com/movies title=Frozen duration=102 rating=PG genre=Animation is3D=true releasedAt='2013-11-27 00:00:00 UTC' score=7.6
```

Additionally, the product development team has determined that a true movie fanatic must also be able to read a `movie` entity using the web app. After all, a user can't create information and never look at it again. Therefore, your second job will be to augment the same server-side web application with the ability to handle the following RESTful HTTP request as well.

```shell
http GET moviejunkies.com/movies/1
```

Finally, the product development team has determined that the movie information needs to be persisted somewhere resilient. The user doesn't care how the information is persisted, so long as he or she can create or read `movie` entities even if the web application is restarted due to maintenance or unforeseen outages. Therefore, your third job will be to augment the same server-side web application with the ability to persist the information resiliently.

In this course, you've learned how a server-side web application can manage information persisted to a JSON file. So based on our product's requirements and your experience working with JSON files, let's look at a diagram of a server-side web application handling the above HTTP requests and responses with a JSON file.

```text
┌─── Chrome ──┐               ┌── Node.js ──┐               ┌─ JSON file ─┐
│             │─── request ──▶│             │──── write ───▶│             │
│             │               │             │               │             │
│             │               │             │               │             │
│             │               │             │               │             │
│             │               │             │               │             │
│             │◀── response ──│             │◀─── read ─────│             │
└─────────────┘               └─────────────┘               └─────────────┘
```

Let's look at another diagram, this time of a server-side web application handling the above HTTP requests and responses with a database system.

```text
┌─── Chrome ──┐               ┌── Node.js ──┐               ┌── database system ──┐
│             │─── request ──▶│             │──── write ───▶│                     │
│             │               │             │               │                     │
│             │               │             │               │                     │
│             │               │             │               │                     │
│             │               │             │               │                     │
│             │◀── response ──│             │◀─── read ─────│                     │
└─────────────┘               └─────────────┘               └─────────────────────┘                                                                                      ╚════════════════════════════════╝
```

In a development environment, the server-side web application and its companion database system often live on the same machine. However, in a production environment, the two systems often live on different machines to maximum the performance of each.

### Exercise

Take a few moments to diagram how server-side web applications manage information using a database system.

Once you've finished, turn to a neighbor and explain how information flows throw the two systems. Then, explain how information stays at rest when either of the two systems are turned off.

## What's a relational database system?

A **relational database system**, or relational database management system (RDBMS), is a database system that's based on the relational model. The **relational model** is an approach to managing information in a table structure (i.e. relation), where an entity is represented as a row and its attributes are represented as columns. For example, here's a `movies` table that contains some movie entities.

```text
 id |       title        | duration | rating |   genre   | is_3d |      released_at       | score
----+--------------------+----------+--------+-----------+-------+------------------------+-------
  1 | Frozen             |      102 | PG     | Animation | t     | 2013-11-26 16:00:00-08 |   7.6
  2 | X-Men: Apocalypse  |      144 | PG-13  | Action    | t     | 2016-05-26 16:00:00-08 |   7.4
  3 | The Princess Bride |       98 | PG     | Adventure | f     | 1987-10-08 16:00:00-08 |   8.1
  4 | Pulp Fiction       |      154 | R      | Crime     | f     | 1994-10-13 16:00:00-08 |   8.9
```

In a relational database system, all values in the same column must be the same data type. For example, here are the data types of the columns for the above `movies` table.

| Column        | Database type | JavaScript type |
|---------------|---------------|-----------------|
| `id`          | `integer`     | `Number`        |
| `title`       | `text`        | `String`        |
| `duration`    | `integer`     | `Number`        |
| `rating`      | `varchar`     | `String`        |
| `genre`       | `text`        | `String`        |
| `is_3d`       | `boolean`     | `Boolean`       |
| `released_at` | `timestamp`   | `Date`          |
| `score`       | `numeric`     | `Number`        |

### Exercise

In your own words, write down what a relational database system means to you. After about 30 seconds, your instructor will cold call on the class and ask what was written down.

## Why is a relational database system so useful?

Using the Movie Junkies example from earlier, imagine the product development team has determined that a true movie fanatic wants to know about every award a `movie` entity has received. Specifically, users want to know the award's kind, name, when the movie received it. One way to solve this is to add more columns to the `movies` table. Here's an example what that might look like.

```text
 id | title  | duration | rating |   genre   | is_3d |      released_at       | score | award_kind |                              award_name                              |   award_received_at
----+--------+----------+--------+-----------+-------+------------------------+-------+------------+----------------------------------------------------------------------+------------------------
  1 | Frozen |      102 | PG     | Animation | t     | 2013-11-26 16:00:00-08 |   7.6 | Oscar      | Best Animated Feature Film of the Year                               | 2014-03-01 16:00:00-08
  2 | Frozen |      102 | PG     | Animation | t     | 2013-11-26 16:00:00-08 |   7.6 | Oscar      | Best Achievement in Music Written for Motion Pictures, Original Song | 2014-03-01 16:00:00-08
```

While this certainly solves the problem, another one is created. There's duplicate information in the form of multiple rows. And wherever there's duplicate information, there's the possibility for inconsistencies to arise. For example, imagine the Frozen movie is recategorized as a `'Comedy'`. Given the current structure, that would require changing information inside of multiple rows.

With a relational database system, a better way to track a movie's awards is with a separate `awards` table with `kind`, `name`, and `received_at` columns. But in order to relate an `award` entity to a `movie` entity, an extra `movie_id` column is required. Here's an example of what that might look like.

```text
 id | movie_id | kind  |                                 name                                 |      received_at
----+----------+-------+----------------------------------------------------------------------+------------------------
  1 |        1 | Oscar | Best Animated Feature Film of the Year                               | 2014-03-01 16:00:00-08
  2 |        1 | Oscar | Best Achievement in Music Written for Motion Pictures, Original Song | 2014-03-01 16:00:00-08
```

Now, a change to a movie's genre only requires a change to one record.

```text
 id | title  | duration | rating |   genre   | is_3d |      released_at       | score
----+--------+----------+--------+-----------+-------+------------------------+-------
  1 | Frozen |      102 | PG     | Comedy    | t     | 2013-11-26 16:00:00-08 |   7.6
```

Since the 1970s, relational database systems have been used to manage all kinds of information—financial, manufacturing, logistical, personal, government, communication, public, private, and so on. By structuring information into tables with rows and columns, computers can quickly and efficiently store and retrieve insanely large amounts data.

### Exercise

In your own words, write down why relational databases are so useful. After about 30 seconds, your instructor will cold call on the class and ask what was written down.

## What's SQL?

In most modern relational database systems, tables and rows are managed with a special-purpose programming language called Structured Query Language (**SQL**). SQL consists of three distinctive languages.

1. A data definition language (DDL) for managing tables.
1. A data manipulation language (DML) for managing rows.
1. A data control language (DCL) for managing permissions to the tables and rows.

In this course, we'll only be focusing on the data definition and data manipulation languages of SQL. Here's an example of a data definition command in SQL.

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

**NOTE:** This is an example of a SQL command split up on multiple lines.

And here are a few examples of data manipulation commands in SQL.

```sql
INSERT INTO movies (title, duration, rating, genre, is_3d, released_at, score) VALUES ('Frozen', 102, 'PG', 'Animation', TRUE, '2013-11-27 00:00:00 UTC', 7.6);
INSERT INTO movies (title, duration, rating, genre, is_3d, released_at, score) VALUES ('X-Men: Apocalypse', 144, 'PG-13', 'Action', TRUE, '2016-05-27 00:00:00 UTC', 7.4);
INSERT INTO movies (title, duration, rating, genre, is_3d, released_at, score) VALUES ('The Princess Bride', 98, 'PG', 'Adventure', FALSE, '1987-10-09 00:00:00 UTC', 8.1);
INSERT INTO movies (title, duration, rating, genre, is_3d, released_at, score) VALUES ('Pulp Fiction', 154, 'R', 'Crime', FALSE, '1994-10-14 00:00:00 UTC', 8.9);
```

**NOTE:** These are examples of SQL commands on a single line. Each one could have been split up on multiple lines.

SQL became an official standard in the mid-1980's. Since then, it has been revised a few times to include a growing set of features. Despite the existence of such standards, most SQL code is not completely portable between different relational database systems without adjustments. The following are popular open source relational database systems that implement the SQL standard.

- MySQL
- PostgreSQL
- SQLite

Whereas the following are popular closed source relational database systems that implement the SQL standard.

- Microsoft Access
- Microsoft SQL Server
- Oracle

### Exercise

In your own words, write down what SQL means to you. After about 30 seconds, your instructor will cold call on the class and ask what was written down.

## What's PostgreSQL?

**PostgreSQL** is a powerful, open source relational database system that's been around since 1996. It has a strong reputation for reliability, data integrity, and correctness. PostgreSQL runs on all major operating systems, including Linux, Mac OS X, and Windows. In addition, PostgreSQL has native interfaces for a number of programming languages, including JavaScript, and is known for its [exceptional documentation](https://www.postgresql.org/docs/current/static/).

PostgreSQL is fully ACID (atomicity, consistency, isolation, durability) compliant and has a vast amount of [built-in data types](https://www.postgresql.org/docs/current/static/datatype.html#DATATYPE-TABLE). The most common of these data types include the following.

- `boolean`
- `character` (`char`)
- `character varying` (`varchar`)
- `integer`
- `numeric`
- `serial`
- `text`
- `timestamp`

PostgreSQL is a sophisticated relational database system. To become fluent in PostgreSQL means to become fluent in all its moving parts. Here's a brief rundown the major moving parts of PostgreSQL.

1. A database server manages a database cluster.
1. A database client connects to a database server.
1. A database client sends SQL commands to a database server.
1. A database server sends rows of information back to a database client.
1. A single database cluster often contains multiple databases.
1. A single database often contains multiple tables.
1. A single table often contains multiple rows of information.
1. Rows are automatically persisted to the hard disk by the database server.

```text
┌─── client  ─┐               ┌─── server ──┐               ╔═══════════════════════════ cluster ═══════════════════════════╗
│             │─── request ──▶│             │──── write ───▶║                                                               ║
│             │               │             │               ║  ┏━━━━━━━━ database ━━━━━━━━┓   ┏━━━━━━━━ database ━━━━━━━━┓  ║
│             │               │             │               ║  ┃                          ┃   ┃                          ┃  ║
│             │               │             │               ║  ┃  ┌──────┬ table ┬─────┐  ┃   ┃  ┌──────┬ table ┬─────┐  ┃  ║
│             │               │             │               ║  ┃  ├──────┼───────┼─────┤  ┃   ┃  ├──────┼───────┼─────┤  ┃  ║
│             │◀── response ──│             │◀─── read ─────║  ┃  ├──────┼───────┼─────┤  ┃   ┃  ├──────┼───────┼─────┤  ┃  ║
└─────────────┘               └─────────────┘               ║  ┃  ├──────┼───────┼─────┤  ┃   ┃  ├──────┼───────┼─────┤  ┃  ║
                                                            ║  ┃  └──────┴───────┴─────┘  ┃   ┃  └──────┴───────┴─────┘  ┃  ║
                                                            ║  ┃                          ┃   ┃                          ┃  ║
                                                            ║  ┃  ┌──────┬ table ┬─────┐  ┃   ┃  ┌──────┬ table ┬─────┐  ┃  ║
                                                            ║  ┃  ├──────┼───────┼─────┤  ┃   ┃  ├──────┼───────┼─────┤  ┃  ║
                                                            ║  ┃  ├──────┼───────┼─────┤  ┃   ┃  ├──────┼───────┼─────┤  ┃  ║
                                                            ║  ┃  ├──────┼───────┼─────┤  ┃   ┃  ├──────┼───────┼─────┤  ┃  ║
                                                            ║  ┃  └──────┴───────┴─────┘  ┃   ┃  └──────┴───────┴─────┘  ┃  ║
                                                            ║  ┃                          ┃   ┃                          ┃  ║
                                                            ║  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛  ║
                                                            ║                                                               ║
                                                            ╚═══════════════════════════════════════════════════════════════╝
```

For example, the Movie Junkies web application from earlier might use a database cluster that contains two databases: a `movie_junkies_dev` database for the development environment and `movie_junkies_test` database for the test environment. A database server is started to manage this database cluster. Then a database client connects to the database server and begins sending SQL commands to the server in order to store or retrieve information from the database cluster.

### Exercise

In your own words, write down what PostgreSQL means to you. After about 30 seconds, your instructor will cold call on the class and ask what was written down.

## Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/current/static/)
- Write SQL directly against the stack overflow DB (MSSQL): http://data.stackexchange.com/stackoverflow/query/new
- https://modern-sql.com/use-case/literate-sql
- [Introduction to Set Theory](https://www.youtube.com/watch?v=yCwnifwVjIg)
- [postgresql-docs](http://www.postgresql.org/docs/manuals/)
- [relational-arch](https://upload.wikimedia.org/wikipedia/commons/5/57/RDBMS_structure.png)
- [relational-db](http://www.vertabelo.com/_file/blog/orms-under-the-hood/data-representation-in-relational-database.png)
