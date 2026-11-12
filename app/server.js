const pg = require("pg");
const express = require("express");
const app = express();
const { hashPassword, validatePassword } = require("./passwordUtil");

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
app.post("/signup", async (req, res) => {
    let body = req.body;

    if ((body.username.length < 1 || body.username.length > 25)) {
        return res.status(400).json({ message: "Please enter valid username" });
    }

    if ((body.email.length < 1)) {
        return res.status(400).json({ message: "Please enter valid email" });
    }

    if ((body.password.length < 1 || body.confirm_pass < 1)) {
        return res.status(400).json({ message: "Password fields cannot be left empty" });
    } else if (!(body.password === body.confirm_pass)) {
        return res.status(400).json({ message: "Password must match" });
    }

    let username = body.username;
    let email = body.email;
    let password = body.password;

    try {
        const hashedPassword = await hashPassword(password);

        await pool.query(
            `Insert into accounts (username, email, password_hash)
            values ($1, $2, $3)`,
            [username, email, hashedPassword]
        );

        res.status(200).json({ message: "Account Created!" });
        
    } catch (error) {
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
    };
});

// login
app.post("/login", async (req,res) =>{
    const {username, password} = req.body || {};

    if (typeof username !== "string" || (username.length < 1 || username.length > 25)) {
        return res.status(400).json({message: "Please enter valid username"});
    }

    if (typeof password !== "string" || (password.length < 1)) {
        return res.status(400).json({message: "Please enter password"});
    }

    try {
        const result = await pool.query(
        'SELECT * FROM accounts WHERE username = $1',
        [username]
        );

        if (result.rows.length === 0){
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const account = result.rows[0];
        
        const validPassword = await validatePassword(
            password,
            account.password_hash
        )

        console.log(validPassword);

        if(!validPassword){
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        return res.status(200).json({
            message: "Login successful",
        });
        
    } catch (error) {
        console.error("Login database error:", error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});

// reset password
app.post("/reset-password", async (req, res) => {
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
 
    console.log("plain: ", body.password, "hashed: ", hashedPassword);
    try {
        const hashedPassword = await hashPassword(body.password);

        pool.query(
            `Update accounts set password_hash = $1 where email = $2`,
            [hashedPassword, body.email]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "No account found with that email" });
        }
        
        return res.status(200).json({ message: "Password updated!" });
    } catch(error) {
        console.log(error);
        res.status(500).json({ message: "Could not reset password" });
    };
});

app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});