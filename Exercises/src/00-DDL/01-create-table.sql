/* Exercise createSports

create a table named sports that has:

- an autoincrementing primary key field named id
- a non-nullable name field that's a varchar

*/

CREATE TABLE sports (
  id serial,
  name varchar NOT NULL
);

/* Exercise createCars

create a table named cars that has:

- an autoincrementing primary key field named id
- a non-nullable varchar column named make
- a non-nullable varchar column named model
- a non-nullable numeric column named year

*/

CREATE TABLE cars (
  id serial NOT NULL,
  make varchar NOT NULL,
  model varchar NOT NULL,
  year numeric NOT NULL
);
