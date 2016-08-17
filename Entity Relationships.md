## Objectives

- Explain what an entity relationship diagram is.
- Explain why an entity relationship diagram is useful.
- Explain what PostgreSQL column constraints are.
- Use PostgreSQL column constraints to implement an entity relationship diagram.
- Explain what a join clause is.
- Explain why a join clause is useful.
- Use an `INNER JOIN` clause to combine rows from different tables.

## Prework

<iframe src="https://player.vimeo.com/video/142034756?byline=0&portrait=0" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

## What's an entity relationship diagram?

An **entity relationship diagram** (ER diagram) is a drawing that represents people, places, or things that are inter-related. As the name suggests, an ER diagram is composed of entities and the relationships that can exist between them. Here's an ER diagram that represents movie, award, and plot entities and their relationships.

```text
┌──────────────┐       ┌─────────────────┐       ┌──────────────┐       ┌──────────────┐
│              │      ╱│                 │╲      │              │      ╱│              │
│    actors    │───────│  actors_movies  │───────│    movies    │───────│    awards    │
│              │      ╲│                 │╱      │              │      ╲│              │
└──────────────┘       └─────────────────┘       └──────────────┘       └──────────────┘
                                                        │
                                                        │
                                                        │
                                                 ┌─────────────┐
                                                 │             │
                                                 │    plots    │
                                                 │             │
                                                 └─────────────┘
```

This ER diagram uses crow's foot notation to specify the relationship cardinalities. **Relationship cardinality** is just a fancy term that means the number of related entities in a relationship. There are three distinct relationship cardinality types.

- One-to-one relationship
- One-to-many relationship
- Many-to-many relationship

A **one-to-one** relationship describes the relationship between two entities where an entity from group `A` may only be linked to an entity of group `B` and vice versa. For example, think of movies as group `A` and plots as group `B`. A movie has only one plot and a plot has only one movie, if it's a good movie.

```text
┌──────────────┐       ┌─────────────┐
│              │       │             │
│    movies    │───────│    plots    │
│              │       │             │
└──────────────┘       └─────────────┘
```

A **one-to-many** relationship describes the relationship between two entities where an entity from group `A` may be linked to many entities from group `B`, but a entity from group `B` is linked to only one entity of group `A`. For example, think of movies as group `A` and awards as group `B`. A movie can have many awards, but an award can only be given to one movie (per year).

```text
┌──────────────┐       ┌──────────────┐
│              │      ╱│              │
│    movies    │───────│    awards    │
│              │      ╲│              │
└──────────────┘       └──────────────┘
```

A **many-to-many** relationship describes the relationship between two entities where many entities of group `A` may be linked to many entities of group `B` and vice versa. For example, think of movies as group `A` and actors as group `B`. An actor can star in many movies and a movie can have many actors.

```text
┌──────────────┐       ┌─────────────────┐       ┌──────────────┐
│              │      ╱│                 │╲      │              │
│    actors    │───────│  actors_movies  │───────│    movies    │
│              │      ╲│                 │╱      │              │
└──────────────┘       └─────────────────┘       └──────────────┘
```

As you can see here, a many-to-many relationship is the combination of two one-to-many relationships connected to an **associative entity** in the middle. We'll talk more about associative entities in a bit.

### Exercise

With your neighbors, draw an ER diagram to represent the relationship between pet entities and species entities.

Once you're satisfied with this, add owner entities to the diagram and draw their relationship with pet entities.

Once you're satisfied with this, add one more entity of your choosing to the diagram and draw their relationship with the other entities as appropriate.

## Why is an entity relationship diagram useful?

An ER diagram is the result of analyzing a problem domain to better understand how its entities and their relationships exist over time. The processes that modify entities and their relationships can often be hard to describe in words. For example, how do you describe the programming logic of a movie winning an award to a person who doesn't understand how to code (e.g. you future boss)? An ER diagram can be useful to represent these processes graphically.

Additionally, an ER diagram is often created to represent the persistence needs of a new feature in a web application. Typically, creating an ER diagram is the first step toward forming a relational database structure for the feature. In a relational database, the relationships between entities are implemented by storing the primary key of one entity as a foreign key in the table of another entity.

In a relational database, a **primary key** is the unique identifier of a table row, usually the `id` column. While other tables may use the same value, the primary key for every row in the same table is guaranteed to be unique and never reused. A **foreign key** is the unique identifier of a row stored in a foreign key column of another table. The name of a foreign key column is usually the singular form of the entity's table name with an `_id` suffix. For example, the `movie_id` foreign key column that references the `id` primary key column of the `movies` tables.

In a one-to-many relationship, the primary key of one table row is stored as the foreign key in another table row. The way you determine which table gets the foreign key column is to look at the crow's foot in the ER diagram. The crow's foot touches is the table the needs the foreign key column. In a one-to-one relation, any of the two tables can have the foreign key column, but only one of them needs to have it.

Here's an example ER diagram that represents the relationship between movies and awards in more detail.

```text
┌──────────────┐       ┌──────────────┐
│    movies    │       │    awards    │
│──────────────│       │──────────────│
│ id           │       │ id           │
│ title        │       │ movie_id     │
│ duration     │      ╱│ kind         │
│ rating       │───────│ name         │
│ genre        │      ╲│              │
│ is_3d        │       │              │
│ released_at  │       │              │
│ score        │       │              │
└──────────────┘       └──────────────┘
```

Using the diagram, it's easy to see how you'd create the `movies` and `awards` tables. Here are some example `CREATE TABLE` commands that'll create tables based on the above ER diagram.

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

CREATE TABLE awards (
  id serial,
  movie_id integer,
  kind varchar(50),
  name text
);
```

And with the tables defined, it's easy to see how you'd insert some rows into them. Here are some an example `INSERT` commands insert rows into the tables from above.

```sql
INSERT INTO movies (title, duration, rating, genre, is_3d, released_at, score)
VALUES ('Frozen', 102, 'PG', 'Animation', 't', '2013-11-26 16:00:00-08', 7.6);

INSERT INTO awards (movie_id, kind, name)
VALUES (1, 'Oscar', 'Best Animated Feature Film of the Year');

INSERT INTO awards (movie_id, kind, name)
VALUES (1, 'Oscar', 'Best Achievement in Music Written for Motion Pictures, Original Song');
```

Here's the above movie entity's unique identifier being stored as the `id` primary key in the `movies` table.

```text
 id | title  | duration | rating |   genre   | is_3d |      released_at       | score
----+--------+----------+--------+-----------+-------+------------------------+-------
  1 | Frozen |      102 | PG     | Animation | t     | 2013-11-26 16:00:00-08 |   7.6
```

And here's the same movie entity's unique identifier being stored as the `movie_id` foreign key in the `awards` table for two award entities.

```text
 id | movie_id | kind  |                                 name                                 
----+----------+-------+----------------------------------------------------------------------
  1 |        1 | Oscar | Best Animated Feature Film of the Year                               
  2 |        1 | Oscar | Best Achievement in Music Written for Motion Pictures, Original Song
```

### Exercise

With your neighbors, add some attributes to the pet-based ER diagram that you created earlier.

Once you're satisfied with the diagram, write a `CREATE TABLE` SQL command for each entity.

Once you're satisfied with the tables, write some `INSERT` SQL commands to seed each table.

## What are PostgreSQL column constraints?

Data types are a way to limit the kind of information that can be stored in a table. For many web applications, however, the constraints they provide are not strict enough. It's common for web applications to constrain column data with respect to other columns or rows. For example, in a table containing product information, there should be only one row for each product number.

To that end, PostgreSQL allows you to define **column constraints** on tables. Constraints give you as much control over the data in your tables as you wish. If an application attempts to store data in a column that would violate a constraint, an error is raised.

The PostgreSQL column constraints useful for entity relationships are the following.

1. Not-null constraints
1. Unique constraints
1. Primary key constraints
1. Foreign key constraints

A **not-null constraint** simply specifies that a column must not assume the null value. A table can have more than one column with a not-null constraint.

**NOTE:** The `serial` data type automatically adds not-null constraint to the column.

```sql
CREATE TABLE movies (
  id serial,
  title text,
  is_3d boolean NOT NULL
);
```

A **unique constraint** ensures that the data contained in a column is unique among all the rows in the table. Adding a unique constraint automatically creates a unique index on the column, which is something we'll discuss later. A table can have more than one column with a unique constraint.

```sql
CREATE TABLE movies (
  id serial UNIQUE,
  title text,
  is_3d boolean NOT NULL
);
```

A **primary key constraint** indicates that a column can be used as a unique identifier for rows in the table. This constraint requires the values in the primary key column to be both unique and not null. Adding a primary key constraint automatically creates a unique index on the column, which is something we'll discuss later. A table can only have one column with a primary key constraint.

```sql
CREATE TABLE movies (
  id serial PRIMARY KEY,
  title text,
  is_3d boolean NOT NULL
);
```

A **foreign key constraint** specifies that the values in a column must match the values appearing in some row of another table. This constraint is used to maintain the referential integrity between two related tables. A table can have more than one column with a foreign key constraint. A foreign key constraint can also cascade the deletion of its specified row. In other words, when the referenced row is deleted, the row(s) referencing it should be automatically deleted as well.

**NOTE:** Typically, a foreign key has a not-null constraint to prevent orphaned entities from being inserted.

```sql
CREATE TABLE movies (
  id serial PRIMARY KEY,
  title text,
  is_3d boolean NOT NULL
);

CREATE TABLE awards (
  id serial PRIMARY KEY,
  movie_id integer NOT NULL REFERENCES movies ON DELETE CASCADE,
  name text
);
```

### Exercise

Write down the four PostgreSQL column constraints and explain each one in your own words. After about 30 seconds, your instructor will cold call on the class and ask what was written down.

## How do you use PostgreSQL column constraints to implement an entity relationship diagram.

In a relational database system, a one-to-one relationship exists when one row in table A is linked with only one row in table B.

```sql
CREATE TABLE movies (
  id serial PRIMARY KEY,
  title text,
  duration integer,
  rating varchar(10),
  genre text,
  is_3d boolean NOT NULL,
  released_at timestamp with time zone,
  score numeric(3, 1)
);

CREATE TABLE plots (
  id serial PRIMARY KEY,
  movie_id integer UNIQUE NOT NULL REFERENCES movies ON DELETE CASCADE,
  summary text
);
```

In a relational database, a one-to-many relationship exists when one row in table A is linked with many rows in table B, but one row in table B is linked to only one row in table A.

```sql
CREATE TABLE movies (
  id serial PRIMARY KEY,
  title text,
  duration integer,
  rating varchar(10),
  genre text,
  is_3d boolean NOT NULL,
  released_at timestamp with time zone,
  score numeric(3, 1)
);

CREATE TABLE awards (
  id serial PRIMARY KEY,
  movie_id integer NOT NULL REFERENCES movies ON DELETE CASCADE,
  kind text,
  name text
);
```

In a relational database management system, a many-to-many relationship is implemented by means of an join table, AB, with two one-to-many relationships. A -> AB and B -> AB. In this case the logical primary key for AB is formed from the two foreign keys.

```sql
CREATE TABLE movies (
  id serial PRIMARY KEY,
  title text,
  duration integer,
  rating varchar(10),
  genre text,
  is_3d boolean NOT NULL,
  released_at timestamp with time zone,
  score numeric(3, 1)
);

CREATE TABLE actors (
  id serial PRIMARY KEY,
  name text,
  bio text,
  birthed_at timestamp with time zone
);

CREATE TABLE actors_movies (
  id serial PRIMARY KEY,
  actor_id integer NOT NULL REFERENCES actors ON DELETE CASCADE,
  movie_id integer NOT NULL REFERENCES movies ON DELETE CASCADE,
  role text
);
```

```shell
dropdb movie_junkies_dev
createdb movie_junkies_dev
curl -fsSL https://git.io/voXVD | psql movie_junkies_dev
psql movie_junkies_dev
```

Spend some time getting familiar with the tables and their relationships.

```
\dt
\d movies
\d plots
\d awards
\d actors
\d actors_movies
```

[PLAY WITH INSERTED ROWS]

### Exercise

With your neighbors, add the necessary PostgreSQL column constraints to the `CREATE TABLE` commands you created earlier for your pet-based ER diagram.

## What's a join clause and why is it useful?

In SQL, **join clause** is an optional part of a `SELECT` command that combines rows from two or more tables by joining on columns that are common to each. The combined rows can be viewed or even saved to a new table. The following is an example of a join clause.

**NOTE:** Type the `\x auto` REPL command to automatically use PostgreSQL's extended display mode.

```sql
SELECT * FROM movies INNER JOIN awards ON awards.movie_id = movies.id;
```

There are five types of join clauses.

- `INNER JOIN`
- `LEFT OUTER JOIN`
- `RIGHT OUTER JOIN`
- `FULL OUTER JOIN`
- `CROSS JOIN`

![SQL JOINS](http://www.codeproject.com/KB/database/Visual_SQL_Joins/Visual_SQL_JOINS_orig.jpg)

In this lesson, you'll only play with `INNER JOIN` clauses.

## How do you use an `INNER JOIN` clause to combine rows from different tables?

The following SQL commands all produce the same rows.

```sql
SELECT * FROM movies INNER JOIN awards ON awards.movie_id = movies.id;

SELECT * FROM movies
INNER JOIN awards ON awards.movie_id = movies.id;

SELECT *
FROM movies
INNER JOIN awards
  ON awards.movie_id = movies.id;

SELECT * FROM movies INNER JOIN awards ON movies.id = awards.movie_id;
```

```sql
SELECT title, kind, name FROM movies INNER JOIN awards ON awards.movie_id = movies.id;
```

```sql
SELECT id, title, kind, name FROM movies INNER JOIN awards ON awards.movie_id = movies.id;
```

When there's a duplicate column name, you need to prefix it with the table name and dot `.` operator.

```sql
SELECT movies.id, title, kind, name
FROM movies INNER JOIN awards ON awards.movie_id = movies.id;
```

```sql
SELECT movies.id, awards.id, title, kind, name
FROM movies INNER JOIN awards ON awards.movie_id = movies.id;
```

```sql
SELECT movies.id AS movie_id, awards.id AS awards.id, title, kind, name
FROM movies INNER JOIN awards ON awards.movie_id = movies.id;
```

```sql
SELECT movies.id, title, kind, name FROM movies
INNER JOIN awards ON awards.movie_id = movies.id WHERE movies.id = 1;
```

```sql
SELECT title, kind FROM movies
INNER JOIN awards ON awards.movie_id = movies.id;
```

```sql
SELECT DISTINCT title, kind
FROM movies INNER JOIN awards ON awards.movie_id = movies.id;
```

```sql
SELECT DISTINCT title, kind FROM movies
INNER JOIN awards ON awards.movie_id = movies.id ORDER BY title ASC;
```

```sql
SELECT title, role FROM movies
INNER JOIN actors_movies ON actors_movies.movie_id = movies.id;
```

```sql
SELECT title, role, name, birthed_at FROM movies
INNER JOIN actors_movies ON actors_movies.movie_id = movies.id
INNER JOIN actors ON actors.id = actors_movies.actor_id;
```

```sql
SELECT title, role, name, birthed_at FROM movies
INNER JOIN actors_movies ON actors_movies.movie_id = movies.id
INNER JOIN actors ON actors.id = actors_movies.actor_id
WHERE movies.id = 3;
```

```sql
SELECT title, role, name, birthed_at FROM movies
INNER JOIN actors_movies ON actors_movies.movie_id = movies.id
INNER JOIN actors ON actors.id = actors_movies.actor_id
WHERE movies.id = 3
  AND birthed_at >= '1962-01-01 00:00:00 UTC';
```

```sql
SELECT title, role, name, birthed_at FROM movies
INNER JOIN actors_movies ON actors_movies.movie_id = movies.id
INNER JOIN actors ON actors.id = actors_movies.actor_id
WHERE movies.id = 3
  AND birthed_at >= '1962-01-01 00:00:00 UTC'
ORDER BY birthed_at DESC;
```

SELECT
  title,
  released_at,
  score,
  actors.name AS actor_name,
  role
FROM movies
INNER JOIN actors_movies ON actors_movies.movie_id = movies.id
INNER JOIN actors ON actors.id = actors_movies.actor_id
ORDER BY score DESC;

### Exercise

Write an SQL command that displays the follow rows.

```
       title        |      released_at       | score |     actor_name     |           role
--------------------+------------------------+-------+--------------------+--------------------------
 Pulp Fiction       | 1994-10-13 17:00:00-07 |   8.9 | John Travolta      | Vincent Vega
 Pulp Fiction       | 1994-10-13 17:00:00-07 |   8.9 | Amanda Plummer     | Honey Bunny / Yolanda
 Pulp Fiction       | 1994-10-13 17:00:00-07 |   8.9 | Tim Roth           | Pumpkin / Ringo
 Pulp Fiction       | 1994-10-13 17:00:00-07 |   8.9 | Samuel L. Jackson  | Jules Winnfield
 The Princess Bride | 1987-10-08 17:00:00-07 |   8.1 | Robin Wright       | The Princess Bride
 The Princess Bride | 1987-10-08 17:00:00-07 |   8.1 | Cary Elwes         | Westley
 The Princess Bride | 1987-10-08 17:00:00-07 |   8.1 | Chris Sarandon     | Prince Humperdinck
 Frozen             | 2013-11-26 16:00:00-08 |   7.6 | Idina Menzel       | Elsa
 Frozen             | 2013-11-26 16:00:00-08 |   7.6 | Kristen Bell       | Anna
 X-Men: Apocalypse  | 2016-05-26 17:00:00-07 |   7.4 | Jennifer Lawrence  | Raven / Mystique
 X-Men: Apocalypse  | 2016-05-26 17:00:00-07 |   7.4 | Michael Fassbender | Erik Lehnsherr / Magneto
 X-Men: Apocalypse  | 2016-05-26 17:00:00-07 |   7.4 | James McAvoy       | Professor Charles Xavier
```

## Exercises

- [Online Retailer](https://github.com/gSchool/sql-curriculum/blob/solutions/Unit-02-Relational/02-readme.md)

## Resources

- [CODING HORROR - A Visual Explanation of SQL Joins](https://blog.codinghorror.com/a-visual-explanation-of-sql-joins/)
- [Lucidchart - ER Diagram Symbols and Meaning](https://www.lucidchart.com/pages/ER-diagram-symbols-and-meaning)
- [PostgreSQL Documentation - Constraints](https://www.postgresql.org/docs/9.5/static/ddl-constraints.html)
- [Wikipedia - Associative entity](https://en.wikipedia.org/wiki/Associative_entity)
- [Wikipedia - Entity relationship model](https://en.wikipedia.org/wiki/Entity%E2%80%93relationship_model)
- [Wikipedia - Many-to-many (data model)][many-to-many]
- [Wikipedia - Many-to-one (data model)][many-to-one]
- [Wikipedia - One-to-one (data model)][one-to-one]
- [Youtube - Entity Relationship Diagram Training](https://www.youtube.com/watch?v=-fQ-bRllhXc)
- [Youtube - Introduction to Set Theory](https://www.youtube.com/watch?v=yCwnifwVjIg)

## Diagram Apps

- [Draw.io](https://www.draw.io/)
- [Lucidchart](https://www.lucidchart.com/)
- [Monodraw](http://monodraw.helftone.com/)

## Videos

### Entity Relationship Diagrams (ERD)

<iframe src="https://player.vimeo.com/video/142034756?byline=0&portrait=0" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

[many-to-many]: https://en.wikipedia.org/wiki/Many-to-many_(data_model)
[many-to-one]: https://en.wikipedia.org/wiki/Many-to-one_(data_model)
[one-to-one]: https://en.wikipedia.org/wiki/One-to-one_(data_model)
