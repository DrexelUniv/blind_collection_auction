const argon2 = require("argon2");

// hash password
async function hashPassword(password) {
    let hash;
    try {
        hash = await argon2.hash(password);
    } catch (error) {
        console.log(error);
        return;
    }

    // returns hashed password
    return hash;
}

// validate password
// password = user inputted plaintext password
// hash = stored hashed password
async function validatePassword(password, hash) {
    let matched = await argon2.verify(hash, password);

    return matched;
}

module.exports = {
    hashPassword,
    validatePassword
}