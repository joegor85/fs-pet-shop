DROP TABLE IF EXISTS pets;

CREATE TABLE pets (
id serial PRIMARY KEY,
age integer,
kind varchar(25),
name varchar(25)
);