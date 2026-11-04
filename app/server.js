const pg = require("pg");
const express = require("express");
const app = express();

const port = 3000;
const hostname = "localhost";

const env = require("../env.json");
const Pool = pg.Pool;
const pool = new Pool(env);
pool.connect()
    .then(function (client) {
        console.log(`Connected to database ${env.database}`);
        client.release();
    })
    .catch(function (err) {
        console.error("Database connection failed:", err.message);
    });

app.use(express.json());
app.use(express.static("public"));

// signup



app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});