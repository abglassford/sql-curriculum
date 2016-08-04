## Relational Databases

Suppose we were building an application that allows users to build resumes. In this data model we have tables for

- `users`
- `resumes`
- `employments`
- `employments_resumes`

Logically in our application, each user may have as many employments and resumes as they want. A resume consists of multiple of employments, for which the relationship is stored in `employments_resumes`.

In the next few exercises you'll learn how to join these together.

## Setup

1. At the terminal, clone the following repository and then build a database using the SQL file included:

```
git clone git@github.com:gSchool/sql-curriculum.git
cd sql-curriculum
createdb resume_builder
psql resume_builder -f unit-2/examples/01-statements.sql
psql -d resume_builder
```

> `createdb` is a command line utility that was installed when you ran `brew install postgresql` and it simply creates a new postgres database.  It's the same as going into `psql` and typing `create database resume_builder`.  If you need to drop that database and start over again, you can do that with `dropdb resume_builder`.

# Objectives

1. Model 1 to Many and Many to Many relationships in SQL.
1. Explain what join statements are in the context of SQL.
1. Alias columns and tables in SQL `SELECT` statements.
1. Write more complex inner join statements (join on more than 1 table).

## 1 To Many (1:M) Relationships

One to many relationships are found often in sql.  They are used to express situations that can be described by A has many B's.  For example, a car make might have many models.  For the relationship to work as a 1 to many, there must be only 1 make who __has many__ models.

The relationship is expressed in SQL using a foreign key:

__makes__

| id | name         |
|----|--------------|
| 1  | Ford         |
| 2  | Chevy        |
| 3  | Ferari       |
| 4  | Jaguar       |

__models__

| id | name         | year          | make_id       |
|----|--------------|---------------|---------------|
| 1  | Probe        | 1993          |     1         |
| 2  | Volt         | 2016          |     2         |
| 3  | Enzo         | 2014          |     3         |
| 4  | Mustang      | 2009          |     1         |
| 5  | F-150        | 2002          |     1         |

__Exercise__

In the above example, which column is the foreign key?

## Many to Many (M:M) Relationships

The relationships that get expressed in your database are often many to many.  For example, a student takes many courses and a course has many students.  At first you might try to solve this problem by putting multiple instances in a table:

#### Incorrect Many to Manny Relationship
----
__students__

| id | name         |
|----|--------------|
| 1  | John         |
| 2  | Jacob        |
| 3  | Jingleheimer |
| 4  | Schmidt      |

__courses__

| id | course_name  | student_id    |
|----|--------------|---------------|
| 1  | Math         | 1|
| 2  | Math         | 2|
| 3  | Science      | 4|
| 2  | Math         | 3|

This does not work for a few reasons.  First, we are duplicating data.  The math course apears 3 times in the courses table.  Secondly, querying for the data we want becomes much harder.  The correct way to solve the problem is to add an additional table that describes the many to many relationship:

#### Correct Many to Many Relationship

----

__students__

| id | name         |
|----|--------------|
| 1  | John         |
| 2  | Jacob        |
| 3  | Jingleheimer |
| 4  | Schmidt      |

__enrollments__

| id | course_id | student_id |
|----|-----------|------------|
| 1  |  1        | 1          |
| 2  |  1        | 2          |
| 3  |  2        | 4          |
| 4  |  1        | 3          |
__courses__

| id | course_name  |
|----|--------------|
| 1  | Math         |
| 2  | Science      |


__EXERCISE__

* Which columns are foreign keys in the above many to many relationship?

## What JOINs are and why they are useful

A SQL `JOIN` statement combines records from two or more tables in a relational database. It creates a set that can be saved as a new table or simply viewed.

Additionally, you can combine fields from two or more tables by using joining on values that are common to each. There are five types of joins, though in this lesson, we'll only cover the first one:

- `INNER JOIN`
- `LEFT OUTER JOIN`
- `RIGHT OUTER JOIN`
- `FULL OUTER JOIN`
- `CROSS JOIN`

As a full stack developer, you'll save data in separate tables and then use joins to get it back together.

## Learn the data model

Recall that `\d` in `psql` lists all relations (or tables) in the database, and `\d table_name` lists the specific structure of `table_name`. So to get more details about these tables, spend some time getting familiar with their structure and where they connect (e.g. spots where we can join data).

To start, run the following commands:

```
psql resume_builder
\dt
\d users
\d resumes
\d employments
\d employment_resumes
```

## Review

Just to get into the data model a little, and review your SQL, open the `resume_builder` database with `psql`, and perform the following queries:

1. Select the `first_name` and `last_name` for all `users`.
1. Select all `resumes` (all columns).
1. Select all `employments` for `user_id = 3` and `user_id = 4` (<- would you use an `and` or and `or` here?)

## Selecting with table names / Aliasing

When joining two columns, you'll sometimes need to include two columns that have the same name.  In these cases, you'll need to specify which table it comes from, which looks like this:

```sql
SELECT users.id, users.first_name FROM users;
```

Notice how the output does _not_ include the table name:

```
 id | first_name
----+------------
  1 | Ty
  2 | Joe
  3 | Hank
  4 | Ted
```

Sometimes you'll also want to rename the column, which you can do with an alias, like so:

```sql
SELECT users.id AS user_id, users.first_name FROM users;
```

When you run that, notice that the column name in the output is `user_id`:

```
 user_id | first_name
---------+------------
       1 | Ty
       2 | Joe
       3 | Hank
       4 | Ted
```

Additionally, you can save yourself some typing by aliasing the name of the table as well:

```sql
SELECT u.id AS user_id, u.first_name FROM users as u;
```

The results are the same as the previous statement, but the sql is a little shorter now.

## Joins - Syntax

Unlike Mongo and most document databases and key-value stores, in SQL you can easily make a single query that returns data from multiple tables.  The syntax looks like this:

```sql
SELECT * FROM users
INNER JOIN employments ON employments.user_id = users.id;
```

In SQL newlines and spacing don't matter, so the same query might look like this:

```sql
SELECT * FROM users INNER JOIN employments ON employments.user_id = users.id;
```

or this...

```sql
SELECT *
FROM users
INNER JOIN employments
  ON employments.user_id = users.id;
```

Some things in SQL are case-sensitive, like the values in your `where` clauses, but for keywords the case doesn't matter.  So you also might see that same query look like this:

```sql
select *
from users
inner join employments
  on employments.user_id = users.id;
```

Notice that `ON` clause?  It doesn't matter which table is listed on which side, so these two are equivalent:

```sql
INNER JOIN employments ON employments.user_id = users.id;
```

and...

```sql
INNER JOIN employments ON users.id = employments.user_id;
```

## Inner / Left / Right Joins

There are several different ways you can join data.  Three common ways are `INNER JOIN`, `LEFT JOIN` and `RIGHT JOIN`.

__EXERCISE__

Take a few minutes to search the internet for the differences between the three - joins have been around for years, so there's a plethora of great information and articles on what they are / when to use them.

...

Have you searched yet?  No really - go do that :)

You're back?  Awesome - let's talk about how to use them. Here is an image that could be useful:

![SQL JOINS](http://www.codeproject.com/KB/database/Visual_SQL_Joins/Visual_SQL_JOINS_orig.jpg)

## Multiline queries in `psql`

When you run SQL queries/commands in `psql`, you need to make sure they end with a semi-colon.  If you hit ENTER before putting a semi-colon, that's OK - just add one and hit ENTER and it will work.  That's because `psql` allows you to enter multi-line SQL statements.

When working with joins, it's often nice to enter multi-line statements.  Take one of the multi-line SQL statements from above and type it in by hand, and make sure to end it with a semi-colon.

In `psql` you can run the previous command by using the up arrow, or using `CTRL+P` (just like the command line).  When you arrow up to a multi-line command, you see the whole command (in multiple lines) and you can use arrow keys to go back through the text.  Use `CTRL+A` to go to the beginning (just like the command line) and `CTRL+E` to go to the end.

## Join'em up!

__EXERCISE__

1. Get all of the users along with each employment the user has had.  You will need to do a join with the `employments` table.
1. Select `first_name`, `last_name`, `title`, `organization`, `start_year`, and `end_year` from the `users` table joined to the `employments` table.
1. Take the query from above and sort it by the `start_year` ascending. (hint: read this http://www.postgresql.org/docs/9.1/static/queries-order.html)
1. Select `title`, `organization`, `start_year`, and `end_year` from `employments` for `resume_id = 1` (hint: `\d employments_resumes`)

#### Three things to note
- The order of the equality doesn't matter: `resumes.id = employment_resumes.resume_id` is equivalent to `employment_resumes.resume_id = resumes.id`.
- When there's a duplicate field name, you need to specify the table name.
- When you are displaying 2 fields with the same name and want to differentiate them in the JOIN, use aliases.

An example of the last two notes:

```sql
SELECT users.id AS user_id, employments.id AS employments_id
FROM users
INNER JOIN employments ON employments.user_id = users.id;
```

## Chaining Joins

Every SQL query needs to have a `from` clause.  Once you have table in the `from` clause, you can join onto it.  And you can _also_ join onto tables that have been mentioned in joins, like so:

```sql
SELECT *
FROM comments
INNER JOIN articles ON articles.id = comments.article_id
INNER JOIN authors ON authors.id = articles.author_id
```

Knowing that, now write a query that gets all the users, the users employments, the name of the user's resumes.  You should:

- starts with the `employments_resumes` table aliased to `er`
- includes the `id` column from the `employments_resumes` table
- includes the `first_name` and `last_name` columns from the `users` table aliased as `u`
- includes the `name` from the `resumes` table aliased as `r`
- includes the `start_year` and `end_year` columns from the `employments` table aliased as `e`.

You know you have it correct when your result set looks like this:

```
id | first_name | last_name |         name         | start_year | end_year
----+------------+-----------+----------------------+------------+----------
 1 | Ty         | Cobb      | First Attempt Resume |       1905 |     1926
 2 | Ty         | Cobb      | First Attempt Resume |       1927 |     1928
 3 | Ty         | Cobb      | First Attempt Resume |       1921 |     1926
 4 | Joe        | DiMaggio  | My only              |       1936 |     1942
 5 | Joe        | DiMaggio  | My only              |       1946 |     1951
 6 | Hank       | Aaron     | My Favorite Rezzy    |       1954 |     1974
 7 | Hank       | Aaron     | My Favorite Rezzy    |       1975 |     1976
 8 | Ted        | Williams  | Player Resume        |       1939 |     1942
 9 | Ted        | Williams  | Player Resume        |       1946 |     1960
10 | Ted        | Williams  | Manager Resume       |       1969 |     1972
```
