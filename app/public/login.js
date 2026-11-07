
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    errorMessage.textContent = "";
    
    if (username.trim() === "") {
        errorMessage.textContent = "Please enter username";
        return;
    }

    if (password === "") {
        errorMessage.textContent = "Please enter password";
        return;
    }

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            errorMessage.textContent = data.message;
            return;
        }

        alert("Login successful!");

        // Redirect can be added once the homepage is made

    } catch (error) {
        errorMessage.textContent =
            "Unable to connect to server";
    }
});
