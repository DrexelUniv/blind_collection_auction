CREATE TABLE IF NOT EXISTS accounts (
    id serial PRIMARY KEY,
    username varchar(25) NOT NULL UNIQUE,
    email varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS items (
    id serial PRIMARY KEY,
    name varchar(150),
    brand varchar(100),
    series varchar(150),
    quality varchar(25),
    up_for_trade boolean DEFAULT false,
    image Text,
    rarity varchar(25)
);


-- Update existing items tables with collectible fields
ALTER TABLE items
    ALTER COLUMN name TYPE varchar(150),
    ALTER COLUMN brand TYPE varchar(100),
    ALTER COLUMN series TYPE varchar(150);

ALTER TABLE items
    ADD COLUMN IF NOT EXISTS image TEXT,
    ADD COLUMN IF NOT EXISTS rarity varchar(25);