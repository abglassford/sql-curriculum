## Joins continued

Suppose we were building an E-commerce application that sells althetic equipment.  We would create the following tables:

* `customers` - All the contact info about a customer
* `items` - Items for sale
* `orders` - The history of all orders a customer has made
* `orderitems` - A record of which items were in an order


__EXERCISE__

Given the outline of our database above, how would the tables be related to one another?  Which tables would have a many to many relationship or a one to many relationship.  Which tables would have foreign keys?

### Setup

**Create a new postgresql database**

In your terminal type the command:

```
createdb exercisedb
```

**Import the tables**

From the terminal command line type:

```
psql -d exercisedb -f unit-2/examples/02-statements.sql
```

__EXERCISE__

Explore the database to understand the structure.  Do a few queries to see the customers, the orders, etc.

## Types of Joins

There are 5 main types of join operators.  They are `inner join`, `left join`, `right join`, `full join` and `cross join`.  Here is what each join does:

* `inner join`: matches all columns from table A with table B on a specific column.  If a row from table A or table B that does not have a match, it is ommitted.

* `left join`: matches all columns from table A with table B on a specific column. If a row from table A does not have a match, it is still included in the results.  If a row from table B does not have a match, it is ommitted.

* `right join`: matches all columns from table A with table B on a specific column. If a row from table A does not have a match, it is ommitted.  If a row from table B does not have a match, it is still included in the results.

* `full join`: matches all columns from table A with table B on a specific column. If a row from table A  or table B does not have a match, it is still included in the results.

* `cross join`: The cross join does not have an `on` statement.  It is much more seldomly used.  It simply gets all possible combinations of rows from table A and table B. It does not ensure a column from A matches a column from B.

__Notes:__

* You may see `left outer join`, `right outer join` or `full outer join`.  The outer keyword is implied for all of those joins and is not necessary.  They are the same join.
* In an outer join, when a row from a table does not have a match, the results will have null values for all columns in the other table.

### Join Examples

![SQL JOINS](http://www.codeproject.com/KB/database/Visual_SQL_Joins/Visual_SQL_JOINS_orig.jpg)

In our example database, lets try getting all the customers and their orders.  We'll make sure to include customers who have not made any orders:

```sql
SELECT *
FROM customers as c
LEFT JOIN orders as o ON o.customer_id=c.id;
```

Let's say we only want specific columns. Let's get all properties from the customers plus the order id:

```sql
SELECT c.*, o.id
FROM customers as c
LEFT JOIN orders as o ON o.customer_id=c.id;
```

__Notice__, in some database libraries (like knex), if two columns have the same name, one column will not be returned.  In our case we have c.id and o.id which are the same column name.  We can fix the problem by using an alias for the order id:

```sql
SELECT c.*, o.id as oid
FROM customers as c
LEFT JOIN orders as o ON o.customer_id=c.id;
```

Now, let's get all the items that were purchased in order id 1 and all the items that were not purchased as well.  This is actually a tricky problem.  Why doesn't this get us what we want?:

```sql
SELECT *
FROM orderitems
RIGHT OUTER JOIN items as i ON i.id=orderitems.item_id
WHERE orderitems.order_id=1 or orderitems.order_id is null;
```

The simplest way to achieve what we want is probably using 2 queries:

```sql
SELECT *
FROM items;
```

and

```sql
SELECT *
FROM orderitems
INNER JOIN items as i ON i.id=orderitems.item_id
```



__EXERCISE__

* Find all the customers who have not made any orders
* Just for fun, get all the possible combinations of orders and customers
* Find all the customers with exactly 1 order
* Look at the [exercisedb readme](./examples/02-readme.md).  Work on the exercises in the readme.

# Slides

* [Slides](https://docs.google.com/presentation/d/1D2KDtjzg0dllOQgIFeCg3GsNqxaN9FeNBXsBd9kVCx0/edit?usp=sharing)
* [SQL](https://docs.google.com/presentation/d/1DfB36GeO9nJEs-7D1QIXkgQgjc7hyo2PZ6lQA-qkZwE/edit#slide=id.gd7ac0ef0a_0_8)
* [Postgres/psql](https://docs.google.com/presentation/d/1jlaTZqUeNDk_GvHMS5cqaoQgS03Ocj4t__jQsFHkqrs/edit?usp=sharing)
* [Join & Join Types](http://slides.com/tylerbettilyon/jointypes/)
