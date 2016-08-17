### VIEW

From "Practical PostgreSQL":

While working with SQL, times will often arise when you would like your statements to be re-usable. This is especially the case when working with large or intricate queries. There are few things more frustrating then having to re-type a long query over and over again within psql. Furthermore, it can be highly inefficient to pass excessively large queries over a network to your PostgreSQL server for commonly executed routines.

This is where views can come in handy. Views can be thought of as stored queries, which allow you to create a database object that functions very similarly to a table, but whose contents are dynamically and directly reflective only of the rows which it is defined to select. Views are quite flexible in practice, in that they may address common, simple queries to a single table, as well as extraordinarily complicated ones which may span across several tables.

`CREATE VIEW name AS query`

`SELECT * FROM view`

`DROP VIEW name`
