document.addEventListener("DOMContentLoaded", () =>{
    let savedUser = localStorage.getItem("currentusername");
    let userdisplay = document.getElementById("username");

    if (userdisplay && savedUser) {
        userdisplay.textContent = "@" + savedUser;
    }else if (userdisplay) {
        //default username display
        userdisplay.textContent = "@username"; 
    }

  let displayName = document.getElementById("display-name");
  let newDisplay = localStorage.getItem("currDisplay");

  if (displayName && newDisplay){
    displayName.textContent = newDisplay; 
  }

  if(displayName){
    displayName.style.cursor = "pointer"; 
    displayName.title = "Change display name!";

    displayName.addEventListener("click", () =>{
        let newName = prompt("Enter new display name:", displayName.textContent);
        if(newName){
            displayName.textContent = newName;
            localStorage.setItem("currDisplay", newName); 
        }
    });
  }
});