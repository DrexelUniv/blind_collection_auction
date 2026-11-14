const { Pool } = require("pg");
const env = require("../env.json");

const path = require("path");

const inputFile = process.argv[2] || "./collectibles.example.json";
const collectibles = require(path.resolve(__dirname, inputFile));


const pool = new Pool(env);

async function importCollectibles() {
    try {
        for (const item of collectibles) {
            // Check whether this collectible already exists
            const existing = await pool.query(
                `SELECT id FROM items
                 WHERE name = $1
                 AND brand = $2
                 AND series = $3`,
                [item.name, item.brand, item.series]
            );
        if (existing.rows.length > 0) {
            await pool.query(
        `       UPDATE items
                SET image = $1
                WHERE id = $2`,
                [item.image, existing.rows[0].id]
            );

            console.log(`Updated image: ${item.name}`);
            continue;
        }


            // Insert a new collectible
            await pool.query(
                `INSERT INTO items
                (name, brand, series, image, rarity)
                VALUES ($1, $2, $3, $4, $5)`,
                [
                    item.name,
                    item.brand,
                    item.series,
                    item.image,
                    item.rarity
                ]
            );

            console.log(`Imported: ${item.name}`);
        }

        console.log("Import completed!");
    } catch (error) {
        console.error("Import failed:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

importCollectibles();
