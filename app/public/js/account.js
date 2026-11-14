document.addEventListener("DOMContentLoaded", () =>{
    let savedUser = localStorage.getItem("currentusername");
    let userdisplay = document.getElementById("user-name");

    if (userdisplay && savedUser) {
        userdisplay.textContent = "@" + savedUser;
    }else if (userdisplay) {
        //default username display
        userdisplay.textContent = "@guest_user"; 
    }

  let displayEmail = document.getElementById("email");
  let savedEmail = localStorage.getItem("currEmail");

  if (displayEmail){
    if(savedEmail){
        displayEmail.textContent = savedEmail;
    } else{
        displayEmail.textContent = "username@email.com";

    }
  }

    let displayBio = document.getElementById("bio");
    let newBio = localStorage.getItem("currBio");

  if (displayBio && newBio){
    displayBio.textContent = newBio; 
  }

  if(displayBio){
    displayBio.style.cursor = "pointer"; 
    displayBio.title = "Change bio!";

    //https://www.w3schools.com/jsref/met_win_prompt.asp
    //https://www.w3schools.com/jsref/prop_win_localstorage.asp

    displayBio.addEventListener("click", () =>{
        let newInfo= prompt("Create new bio:", displayBio.textContent);
        if(newInfo){
            displayBio.textContent = newInfo;
            localStorage.setItem("currBio", newInfo); 
        }
    });
    }
});