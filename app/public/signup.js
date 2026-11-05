let button = document.getElementById("submit");
let message = document.getElementById("message");
let username = document.getElementById("username");
let email = document.getElementById("email");
let password = document.getElementById("password");
let confirm_pass = document.getElementById("confirm");

button.addEventListener("click", () => {
    message.textContent = ""; // clear message

    console.log(username.value, email.value, password.value, confirm_pass.value);

    fetch(`/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username.value,
            email: email.value,
            password: password.value,
            confirm_pass: confirm_pass.value
        })

    }).then((response) => {
        return response.json();
    }).then(data => {
        message.textContent = data.message;
    }).catch(error => {
        console.log(error);
    })
})


