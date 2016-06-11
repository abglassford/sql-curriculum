create table customers (
  id serial primary key,
  name varchar not null
);

create table products(
  id serial primary key,
  name varchar not null,
  price_in_cents integer
);

create table orders (
  id serial primary key,
  customer_id integer not null references customers (id),
  submitted_on date not null,
  fulfilled_on date
);

create table order_items(
  id serial primary key,
  order_id integer not null references orders (id),
  product_id integer not null references products (id),
  quantity integer not null references products (id)
);

insert into customers (name) values ('Hagenes Group');
insert into customers (name) values ('Kuhic and Sons');
insert into customers (name) values ('Keebler-Hettinger');

insert into products (name, price_in_cents) values ('Practical Steel Wallet', 1000);
insert into products (name, price_in_cents) values ('Incredible Wooden Keyboard', 1000);
insert into products (name, price_in_cents) values ('Sleek Marble Bench', 1000);
insert into products (name, price_in_cents) values ('Durable Bronze Bottle', 1000);
insert into products (name, price_in_cents) values ('Rustic Concrete Table', 1000);
insert into products (name, price_in_cents) values ('Durable Silk Bag', 1000);

-- Hagenes Group ordered
--    Practical Steel Wallet
--    Incredible Wooden Keyboard
insert into orders (customer_id, submitted_on, fulfilled_on) values (1, (NOW() - interval '6 months')::date, (NOW() - interval '5 months')::date);
insert into order_items (order_id, product_id, quantity) values
  (1, 1, 1),
  (1, 2, 1)
  ;
