/*

Write a query that sums the price of all products that are a part of order with id 1

*/
SELECT sum(price_in_cents) FROM orders
where id = 1;
