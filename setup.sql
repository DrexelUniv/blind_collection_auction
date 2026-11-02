Create DATABASE blind_collection;
\c blind_collection
Create table accounts (
    username varchar(25),
    email varchar(25),
    password varchar(25)
);
Create table items (
    id serial primary key,
    name varchar(25),
    quality varchar(25)
);