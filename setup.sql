CREATE TABLE IF NOT EXISTS accounts (
                                        id            serial PRIMARY KEY,
                                        username      varchar(25)  NOT NULL UNIQUE,
                                        email         varchar(255) NOT NULL UNIQUE,
                                        password_hash varchar(255) NOT NULL,
                                        created_at    timestamptz  NOT NULL DEFAULT now()
);

-- Catalog of item types
CREATE TABLE IF NOT EXISTS items (
                                     id      serial PRIMARY KEY,
                                     name    varchar(25) NOT NULL,
                                     brand   varchar(25),
                                     series  varchar(25),
                                     quality varchar(25)
);

-- The many-to-many: one row = one owned copy of an item
CREATE TABLE IF NOT EXISTS collection_items (
                                                id           serial PRIMARY KEY,
                                                account_id   integer NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                                                item_id      integer NOT NULL REFERENCES items(id)    ON DELETE RESTRICT,
                                                up_for_trade boolean NOT NULL DEFAULT false,
                                                acquired_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_collection_items_account ON collection_items(account_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_item    ON collection_items(item_id);

CREATE TABLE IF NOT EXISTS auctions (
                                        id                 serial PRIMARY KEY,
                                        collection_item_id integer NOT NULL REFERENCES collection_items(id) ON DELETE CASCADE,
                                        seller_id          integer NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                                        starting_price     numeric(12,2) NOT NULL CHECK (starting_price >= 0),
                                        start_time         timestamptz NOT NULL DEFAULT now(),
                                        end_time           timestamptz NOT NULL,
                                        status             varchar(10) NOT NULL DEFAULT 'open'
                                            CHECK (status IN ('open', 'sold', 'cancelled', 'expired')),
                                        CHECK (end_time > start_time)
);
-- A given owned copy can only have one open auction at a time
CREATE UNIQUE INDEX IF NOT EXISTS uq_one_open_auction_per_copy
    ON auctions(collection_item_id) WHERE status = 'open';

CREATE TABLE IF NOT EXISTS bids (
                                    id         serial PRIMARY KEY,
                                    auction_id integer NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
                                    bidder_id  integer NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                                    amount     numeric(12,2) NOT NULL CHECK (amount > 0),
                                    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_auctions_seller ON auctions(seller_id);