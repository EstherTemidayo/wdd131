// CURRENT YEAR

const currentYear = new Date().getFullYear();

document.getElementById("currentyear").textContent = currentYear;


// LAST MODIFIED DATE

document.getElementById("lastModified").textContent =
    `Last Modified: ${document.lastModified}`;