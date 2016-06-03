create table users(
  id serial primary key,
  name varchar not null
);

create table pets(
  id serial primary key,
  user_id int references users(id) not null,
  name varchar not null,
  type varchar not null
);

insert into users (name) values ('Abe');
insert into users (name) values ('Bart');
insert into users (name) values ('Cathy');

insert into pets (user_id, name, type)
  values ((select id from users where name ='Abe'), 'Fido', 'Dog');

insert into pets (user_id, name, type)
  values ((select id from users where name ='Abe'), 'Sparky', 'Dog');

insert into pets (user_id, name, type)
  values ((select id from users where name ='Bart'), 'Muffin', 'Cat');
