CREATE TABLE IF NOT EXISTS accounts (
    id serial PRIMARY KEY,
    username varchar(25) NOT NULL UNIQUE,
    email varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS items (
    id serial PRIMARY KEY,
    name varchar(25),
    brand varchar(25),
    series varchar(25),
    quality varchar(25),
    up_for_trade boolean DEFAULT false
);