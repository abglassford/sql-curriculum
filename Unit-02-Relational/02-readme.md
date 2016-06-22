**Create a new postgresql database**

Open 'psql' and type the command:

```sql
CREATE DATABASE retailer;
```

**Import the tables**

From the terminal command line (not the psql terminal) type:

```
psql retailer -f 02-statements.sql
```

## Review

Before doing more joins, practice making some queries.  Write queries to do the following:

1. display the customers by name in alphabetical order
1. display all customers by their names in reverse alphabetical order
1. display all items from the items table
1. display all boots in the items table
1. Inspect the boot names, investigate wildcard matchers for LIKE command
1. display all orders
1. display first 5 orders
1. display last 5 orders
1. display the name and email address of each customer
1. display the id, name and address of each customer
1. count the number of customers
1. display the customers from Colorado
1. display the customers from Colorado who live in Rigobertoside
1. display the customers from Ohio and Virginia
1. update the name of the item whose description is “snow board” to board01
1. verify the change by viewing the items in the table
1. add an item to the items table with the name: kayak01 and description: one person river kayak
1. verify the entry has been added by viewing the table
1. delete the item that was just added with the name: kayak01 and description: one person river kayak
1. display the total order amount per customer_id in the orders table
1. display the order id, customer name and order amount for each order
1. display the customer id, customer name and total amount of all their orders, list in alphabetical order of the customer name
1. display the customer id, customer name and average amount of all their orders, list in alphabetical order of the customer name
1. display the customer id, customer name and average amount rounded to two decimal places of all their orders, list in alphabetical order of the customer name
1. display all the item names from all the orders that have customer id = 2
1. display all customer ids that have ordered the boot02 item (i.e. item.id = 8)
1. display all customer names that have ordered the bike03 item
1. display the total amount that customer ‘Evert Pfeffer’ has placed on orders for item bike03

BONUSES:

1. add up the dollar amout of all the orders
1. add up the dollar amount of the customer with an id of 1
1. calculate the average dollar amount of the orders
1. calculate the average dollar amount rounded to 2 decimal places of the orders
1. display the minimum order amount of all the orders
1. display the maximum order amount of all the orders
1. display the minimum order amount for each customer_id in orders
1. display the maximum order amount for each customer_id in orders
