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
app.post("/signup", (req, res) => {
    let body = req.body;

    if ((body.username.length < 1 || body.username.length > 25)) {
        return res.status(400).json({message: "Please enter valid username"});
    }

    if ((body.email.length < 1)) {
        return res.status(400).json({message: "Please enter valid email"});
    }

    if (!(body.password === body.confirm_pass)) {
        return res.status(400).json({message: "Password must match"});
    }

    let username = body.username;
    let email = body.email;
    let password = body.password;

    console.log(username, email, password);

    pool.query(
        `Insert into accounts (username, email, password)
         values ($1, $2, $3)`,
        [username, email, password]
    ).then(() => {
        res.status(200).json({ message: "Account Created!" });
    }).catch((error) => {
        console.log(error);

        // PostgreSQL error code 23505 represents a unique_violation
        if (error.code === "23505") {
            if (error.constraint === "accounts_email_key") {
                return res.status(409).json({ message: "An account already exists with that email" });
            }
            if (error.constraint === "accounts_username_key") {
                return res.status(409).json({ message: "An account already exists with that username" });
            }
            return res.status(409).json({ message: "An account already exists with that email or username" });
        }

        res.status(500).json({ message: "Could not create account" });
    });
});

app.post("/login", async (req,res) =>{
    const {username, password} = req.body || {};

    if (typeof username !== "string" || (username.length < 1 || username.length > 25)) {
        return res.status(400).json({message: "Please enter valid username"});
    }

    if (typeof password !== "string" || (password.length < 1)) {
        return res.status(400).json({message: "Please enter password"});
    }

    try{
        const result = await pool.query(
        'SELECT * FROM accounts WHERE username = $1',
        [username]
    )

        if (result.rows.length === 0){
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const account = result.rows[0];

        if(account.password !== password){
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        return res.status(200).json({
            message: "Login successful"
        });
        
    } catch(error){
        console.error("Login database error:", error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});

app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});