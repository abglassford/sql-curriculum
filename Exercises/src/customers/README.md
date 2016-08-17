**Create a new postgresql database**

Open 'psql' and type the command:

```sql
CREATE DATABASE exercisedb;
```

**Import the tables**

From the terminal command line (not the psql terminal) type:

```
cd Exercises/src/customers
psql -d exercisedb -f seeds.sql
```

## Query Practice

Before doing more joins, practice making some queries.  Write queries to do the following:

- display the customers by name in alphabetical order
- display all customers by their names in reverse alphabetical order
- display all items from the items table
Write an sql query to find and display (Retrieve)  all the items. Review the table.

__Questions__

1. display all boots in the items table
Inspect the boot names, investigate wildcard matchers for LIKE command

1. display all orders
Write an sql query to retrieve all the orders. Tip: To get out of a long list, hit esc then hit q

1. display first 5 orders
Write a sql query to retrieve the first 5 orders.

1. display last 5 orders
display the 5 orders with the highest id numbers.

1. display the name and email address of each customer


1. display the id, name and address of each customer


1. count the number of customers


1. add up the dollar amout of all the orders


1. add up the dollar amount of the customer with an id of 1


1. calculate the average dollar amount of the orders


1. calculate the average dollar amount rounded to 2 decimal places of the orders


1. display the minimum order amount of all the orders


1. display the maximum order amount of all the orders


1. display the minimum order amount for each customer_id in orders


1. display the maximum order amount for each customer_id in orders


1. display the customers from Colorado


1. display the customers from Colorado who live in Rigobertoside


1. display the customers from Ohio and Virginia


1. update the name of the item whose description is “snow board” to board01
verify the change by viewing the items in the table

1. add an item to the items table with the name: kayak01 and description: one person river kayak
verify the entry has been added by viewing the table

1. delete the item that was just added with the name: kayak01 and description: one person river kayak


1. display the total order amount per customer_id in the orders table


1. display the order id, customer name and order amount for each order
inner joins make use of the 'customer_id' field in the orders table

1. display the customer id, customer name and total amount of all their orders, list in alphabetical order of the customer name


1. display the customer id, customer name and average amount of all their orders, list in alphabetical order of the customer name


1. display the customer id, customer name and average amount rounded to two decimal places of all their orders, list in alphabetical order of the customer name
same as last story with the average amount rounded to 2 decimal places

1. display all the item names from all the orders that have customer id = 2


1. display all customer ids that have ordered the boot02 item (i.e. item.id = 8)


1. display all customer names that have ordered the bike03 item


1. display the total amount that customer ‘Evert Pfeffer’ has placed on orders for item bike03

---

## Joins continued

Suppose we were building an E-commerce application that sells athletic equipment.  We would create the following tables:

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
cd Exercises/src/customers
psql -d exercisedb -f seed.sql
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
