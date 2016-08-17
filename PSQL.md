## PSQL - PostgreSQL Command Line Tools

Now that a PostgreSQL server running, you can use a variety of command line tools to manage the default PostgreSQL cluster. To list out all the databases in the default cluster, run the following command.

```shell
psql -l
```

And you should see something like this.

![](https://i.imgur.com/57ZyROA.png)

As you can see, there are already a few databases inside the default PostgreSQL cluster. These were created when the cluster was initialized

The `postgres` database is meant to be the default database for users and applications. You can use it as a scratch pad when you're experimenting with new database concepts.

When a new database is created, it's actually a copy of the `template0` and `template1` databases. So it's a good idea to leave these alone. See the [Template Databases](https://www.postgresql.org/docs/current/static/manage-ag-templatedbs.html) article in the PostgreSQL documentation to learn more about them.

Additionally, the default encoding of a PostgreSQL database is `UTF8`. Using the same character encoding throughout your web application is essential for preventing data corruption. You can safely ignore the `Collate`, `Ctype`, and `Access Priviledges` columns for now.

Most database-driven web applications use multiple databases, one for each environment. To create a database for the fictitious Movie Junkies web application from earlier, run the following command.

```shell
createdb movie_junkies_dev
```

And you should see neither a success nor a failure message. To verify that the database was created, check the list of databases again.

```shell
psql -l
```

And you should see something like this.

![](https://i.imgur.com/H8CflcG.png)

To drop (i.e. destroy) the database, run the following command.

```shell
dropdb movie_junkies_dev
```

Again, you should see neither a success nor a failure message. To verify that the database was dropped, check the list of databases again.

```shell
psql -l
```

And you should see something like this.

![](https://i.imgur.com/57ZyROA.png)

### Exercise

Use the `createdb` and `dropdb` command line tools to create and drop a `movie_junkies_dev` database a few times. Each time you create and drop the database, verify the contents of the default PostgreSQL cluster with the `psql` command line tool.

After you've done this a few times, ensure the default PostgreSQL cluster contains a `movie_junkies_dev` database. Then, check out the usage messages for the following commands.

```shell
psql --help
createdb --help
dropdb --help
```

## How do you use PostgreSQL REPL to manage databases in a PostgreSQL cluster?

In addition to the above command line tools, you can manage the databases inside the default PostgreSQL cluster with the PostgreSQL REPL. Similar to the Node.js REPL, the **PostgreSQL REPL** is a read-evaluate-print loop where you can play around and experiment with new database concepts.

The PostgreSQL REPL accepts both REPL commands and SQL commands. You can tell the difference between the two because REPL commands start with a backslash `\` and SQL commands end with a semicolon `;`. In a moment, you'll see some examples of both.

Before you get started with the PostgreSQL REPL, download and install some configuration that your instructors have created for you. To do so, run the following command.

```shell
curl -fsSL https://git.io/voVWg | sh
```

**NOTE:** This configuration will colorize the prompt of your PostgreSQL REPL and allow you to use the `Alt + ←` and `Alt + →` keyboard shortcuts to jump between SQL keywords.

To launch the PostgreSQL REPL, run the following command.

```shell
psql
```

And you should see something like this.

![](https://i.imgur.com/Jy458Ah.png)

Opps! What happened? Well, when the `psql` command line tool is executed without any arguments, it'll attempt to connect to a database with the same name as your user account. To fix this, you can either create a database with the same name as your user account or specify a different database.

To connect the PostgreSQL REPL to the `movie_junkies_dev` database, run the following command.

```shell
psql movie_junkies_dev
```

And you should see something like this.

![](https://i.imgur.com/sNcaEdD.png)

Welcome to the PostgreSQL REPL! To get help, run the following command.

```text
help
```

And you should see something like this.

![](https://i.imgur.com/bQz6Q1s.png)

To see the list of databases inside the default PostgreSQL cluster, run the following command.

```text
\l
```

And you should see something like this.

![](https://i.imgur.com/DDbKKYG.png)

It should be the exact same output as running the `psql -l` command line tool. To create a database for the test environment of the fictitious Movie Junkies web application, run the following SQL command.

**NOTE:** Remember to end SQL commands with a semicolon `;`.

```sql
CREATE DATABASE movie_junkies_test;
```

And you should see something like this.

![](https://i.imgur.com/ybLdKKZ.png)

If you forget to end an SQL command with a semicolon `;`, the PostgreSQL REPL will display another prompt. This is REPL's way of trying to be helpful by  letting you continue writing the command on the next line. It would look something like this.

![](https://i.imgur.com/RjCdoWD.png)

SQL commands can get very long and writing them over multiple lines is extremely useful. However, the PostgreSQL REPL won't execute a SQL command unless it ends with a semicolon `;`. The sure fire way you can tell the REPL is waiting for a semicolon `;` is when the yellow equals sign `=` in the prompt changes to a yellow minus sign `-`. See the above screenshot for an example.

Just remember, SQL commands must be end with a semicolon `;`. So if you're wondering why your SQL command didn't work, check for the yellow minus sign `-`. And if you see it, type in a semicolon `;` and hit the `Enter` key.

![](https://i.imgur.com/3TCOj1w.png)

To verify the database was created, check the list of databases again.

```text
\l
```

And you should see something like this.

![](https://i.imgur.com/XLJb0j7.png)

As you can see from the prompt, the current connected database is the `movie_junkies_dev` database. To connect the REPL to the database you just created, run the following command.

```text
\c movie_junkies_test
```

And you should see something like this.

![](https://i.imgur.com/iK5uWtL.png)

To drop the `movie_junkies_test` database, run the following SQL command.

```sql
DROP DATABASE movie_junkies_test;
```

And you should see something like this.

![](https://i.imgur.com/j1eZMMe.png)

Opps! What happened? It looks like you can't drop the current connected database. To switch the REPL back, run the following command.

```text
\c movie_junkies_dev
```

And you should see something like this.

![](https://i.imgur.com/NytCCbZ.png)

To drop the `movie_junkies_test` database, run the following SQL command again.

```sql
DROP DATABASE movie_junkies_test;
```

And you should see something like this.

![](https://i.imgur.com/EE5BkcP.png)

To verify the database was dropped, check the list of databases again.

```text
\l
```

And you should see something like this.

![](https://i.imgur.com/DDbKKYG.png)


Finally, to quit the PostgreSQL REPL, run the following command.

```text
\q
```

And you should see something like this.

![](https://i.imgur.com/Z2q2KG3.png)

### Exercises

Use the `CREATE DATABASE` and `DROP DATABASE` SQL commands to create and drop a `movie_junkies_test` database a few times. Each time you create and drop the database, verify the contents of the default PostgreSQL cluster with the `\l` REPL command. Also, practice connecting to the new database with the `\c` REPL command.

After you've done this a few times, ensure the default PostgreSQL cluster contains a `movie_junkies_test` database. Then, check out the usage messages for the following REPL commands.

```text
help
\?
\h
```
