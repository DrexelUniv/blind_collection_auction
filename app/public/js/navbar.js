const btn = document.getElementById("profile-btn");
const menu = document.getElementById("profile-dropdown");

function setMenu(open) {
    menu.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
}

btn.addEventListener("click", (e) => {
    e.stopPropagation();
    setMenu(menu.hidden);
});

document.addEventListener("click", (e) => {
    if (!menu.contains(e.target)) setMenu(false);
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
});