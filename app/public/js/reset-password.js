let button = document.getElementById("submit");
let message = document.getElementById("message");
let email = document.getElementById("email");
let new_password = document.getElementById("new-password");
let confirm_pass = document.getElementById("confirm");

button.addEventListener("click", () => {
    message.textContent = ""; 

    if (email.value.length < 1 || new_password.value.length < 1) {
        message.textContent = "Please fill in every field";
        return;
    }

    if (new_password.value !== confirm_pass.value) {
        message.textContent = "Passwords must match";
        return;
    }

    fetch(`/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email.value,
            password: new_password.value,
            confirm_pass: confirm_pass.value
        })
    }).then((response) => {
        return response.json().then((data) => {
            return { ok: response.ok, data: data };
        });
    }).then((result) => {
        if (result.ok) {
            window.location.href = "login.html";
        } 
        else {
            message.textContent = result.data.message;
        }
    }).catch((error) => {
        console.log(error);
        message.textContent = "Could not reach the server";
    });
});