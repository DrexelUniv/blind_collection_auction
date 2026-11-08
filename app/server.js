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

// reset password
app.post("/reset-password", (req, res) => {
    let body = req.body;
 
    if (!body.email || body.email.length < 1) {
        return res.status(400).json({ message: "Please enter valid email" });
    }
 
    if (!body.password || body.password.length < 1) {
        return res.status(400).json({ message: "Please enter a new password" });
    }
 
    if (body.password !== body.confirm_pass) {
        return res.status(400).json({ message: "Passwords must match" });
    }
 
    pool.query(
        `Update accounts set password = $1 where email = $2`,
        [body.password, body.email]
    ).then((result) => {
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "No account found with that email" });
        }
        res.status(200).json({ message: "Password updated!" });
    }).catch((error) => {
        console.log(error);
        res.status(500).json({ message: "Could not reset password" });
    });
});

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

// login
app.post("/login", async (req, res) => {
    let body = req.body;

    if (body.username.trim().length < 1 ) {
        return res.status(400).json({message: "Username field cannot be left empty"});
    } else if (body.username.length > 25) {
        return res.status(400).json({message: "Please enter valid username"});
    }

    if (body.password.length < 1 ) {
        return res.status(400).json({message: "Password field cannot be left empty"});
    }

    let username = body.username.trim();
    let password = body.password;

    console.log(username, password);

    try {
        const userQuery = await pool.query(
            `SELECT * FROM accounts WHERE username = $1`,
            [username]
        );

        // validate existence of username
        if (userQuery.rows.length === 0) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const user = userQuery.rows[0];

        // validate entered password against stored password
        if (password !== user.password) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // successful login
        return res.status(200).json({ 
            message: "Login succesful!",
            userId: user.id,
            username: user.username
        });
        
    } catch (error) {
        console.log("Login error: ", error);

        return res.status(500).json({ message: "error occured during login process" });
    }
        
});

app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});