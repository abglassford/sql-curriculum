/*
you have two tables, users (id, name), and pets (id, user_id, name, type)
write a query that returns all pets along with a column called user_name that shows their user's name
*/
SELECT pets.name, pets.id, pets.type, users.id AS user_id, users.name AS user_name
FROM pets
INNER JOIN users
ON users.id = user_id;
