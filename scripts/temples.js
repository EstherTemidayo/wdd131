// 1. Dynamic Footer Data
const currentYearSpan = document.getElementById("currentyear");
const lastModifiedElement = document.getElementById("lastModified");

// Set the current year automatically
currentYearSpan.textContent = new Date().getFullYear();

// Set the last modification date and time
lastModifiedElement.innerHTML = `Last Modification: <span>${document.lastModified}</span>`;

// 2. Responsive Hamburger Menu Logic
const menuButton = document.getElementById("menuButton");
const navMenu = document.getElementById("animenu");

menuButton.addEventListener("click", () => {
    // Toggle the open class to show/hide menu items
    navMenu.classList.toggle("open");
    menuButton.classList.toggle("open");

    // Toggle the button icon between Hamburger (☰) and Close (X)
    if (menuButton.classList.contains("open")) {
        menuButton.innerHTML = "&#10006;"; // Unicode icon for 'X'
    } else {
        menuButton.innerHTML = "&#9776;";  // Unicode icon for hamburger '☰'
    }
});