**Create a new postgresql database**

Open 'psql' and type the command:

```sql
CREATE DATABASE exercisedb;
```

**Import the tables**

From the terminal command line (not the psql terminal) type:

```
psql -d exercisedb -f 02-statements.sql
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
