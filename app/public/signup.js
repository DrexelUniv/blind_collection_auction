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
        return response.json().then(data => ({
            status: response.status,
            data: data
        }));
    }).then((result) => {
        message.textContent = result.data.message;

        if (result.status >= 200 && result.status < 300) {
            window.location.href = "/index.html";   
        }
    }).catch((error) => {
        console.log(error);
        message.textContent = "Something went wrong.";
    })
})


