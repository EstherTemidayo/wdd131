// 1. Data Source Definition (10 Temples with alternative optimized web image URLs)
const temples = [
    {
        templeName: "Aba Nigeria",
        location: "Aba, Nigeria",
        dedicated: "2005, August, 7",
        area: 11500,
        imageUrl: "images/abatemple.webp"
    },
    {
        templeName: "Manti Utah",
        location: "Manti, Utah, United States",
        dedicated: "1888, May, 21",
        area: 74792,
        imageUrl: "images/manti_temple.webp"
    },
    {
        templeName: "Kinshasa, DR Congo",
        location: "Kinshasa, DR Congo",
        dedicated: "2019, April, 14",
        area: 12000,
        imageUrl: "images/drctemple.webp"
    },
    {
        templeName: "Durban, South Africa",
        location: "Durban, South Africa",
        dedicated: "2020, February, 16",
        area: 19860,
        imageUrl: "images/durban.webp"
    },
    {
        templeName: "Payson Utah",
        location: "Payson, Utah, United States",
        dedicated: "2015, June, 7",
        area: 96630,
        imageUrl: "images/payson.webp"
    },
    {
        templeName: "Yigo Guam",
        location: "Yigo, Guam",
        dedicated: "2020, May, 2",
        area: 6861,
        imageUrl: "images/yigoguam_temple.webp"
    },
    {
        templeName: "Washington D.C.",
        location: "Kensington, Maryland, United States",
        dedicated: "1974, November, 19",
        area: 156558,
        imageUrl: "images/washington.webp"
    },
    {
        templeName: "Lima Perú",
        location: "Lima, Perú",
        dedicated: "1986, January, 10",
        area: 9600,
        imageUrl: "images/limaperu.webp"
    },
    {
        templeName: "Mexico City Mexico",
        location: "Mexico City, Mexico",
        dedicated: "1983, December, 2",
        area: 116642,
        imageUrl: "images/mexico.webp"
    },
    {
        templeName: "Johannesburg South Africa",
        location: "Johannesburg, South Africa",
        dedicated: "1985, August, 24",
        area: 19184,
        imageUrl: "images/satemple.webp"
    },
    {
        templeName: "Accra Ghana",
        location: "Accra, Ghana",
        dedicated: "2004, January, 11",
        area: 17500,
        imageUrl: "images/ghanatemple.webp"
    },
    {
        templeName: "San Diego California",
        location: "San Diego, California, United States",
        dedicated: "1993, April, 25",
        area: 72000,
        imageUrl: "images/sandiego.webp"
    }
];

// 2. DOM Selection Elements
const mainContainer = document.querySelector("main");
const pageTitleElement = document.getElementById("page-title");
const currentYearSpan = document.getElementById("currentyear");
const lastModifiedElement = document.getElementById("lastModified");

// 3. Dynamic Footer Metadata Sync
if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
if (lastModifiedElement) lastModifiedElement.textContent = `Last Modification: ${document.lastModified}`;

// 4. Component Card Generation Engine
function renderTempleGridCardDisplay(filteredList) {
    // Keeps your specific <h2> heading element while clearing cards
    const heading = mainContainer.querySelector("h2");
    mainContainer.innerHTML = "";
    if (heading) mainContainer.appendChild(heading);

    filteredList.forEach(temple => {
        const cardFigure = document.createElement("figure");

        cardFigure.innerHTML = `
            <div class="card-content">
                <h3>${temple.templeName}</h3>
                <p><span>Location:</span> ${temple.location}</p>
                <p><span>Dedicated:</span> ${temple.dedicated}</p>
                <p><span>Size:</span> ${temple.area.toLocaleString()} sq ft</p>
            </div>
            <img src="${temple.imageUrl}" alt="${temple.templeName} Temple Exterior" loading="lazy">
        `;
        mainContainer.appendChild(cardFigure);
    });
}

// 5. Array Criteria Filter Handlers
const filterTriggers = {
    "Home": () => temples,
    "Old": () => temples.filter(t => parseInt(t.dedicated.split(",")) < 1900),
    "New": () => temples.filter(t => parseInt(t.dedicated.split(",")) > 2000),
    "Large": () => temples.filter(t => t.area > 90000),
    "Small": () => temples.filter(t => t.area < 10000)
};

// 6. Navigation Menu Trigger Handlers
document.querySelectorAll("nav a").forEach(linkButton => {
    linkButton.addEventListener("click", (event) => {
        event.preventDefault();

        document.querySelectorAll("nav a").forEach(ln => ln.classList.remove("active"));
        linkButton.classList.add("active");

        const selectionText = linkButton.textContent.trim();
        if (pageTitleElement) pageTitleElement.textContent = selectionText;

        if (filterTriggers[selectionText]) {
            renderTempleGridCardDisplay(filterTriggers[selectionText]());
        }

        // Closes responsive navigation panel menu drawer on mobile views
        const navMenu = document.getElementById("animenu");
        const menuButton = document.getElementById("menuButton");
        if (navMenu && navMenu.classList.contains("open")) {
            navMenu.classList.remove("open");
            menuButton.classList.remove("open");
            menuButton.innerHTML = "☰";
        }
    });
});

// 7. Initial Mount Content Build
renderTempleGridCardDisplay(temples);

// 8. Mobile Hamburger Drawer Logic
const menuButton = document.getElementById("menuButton");
const navMenu = document.getElementById("animenu");

if (menuButton && navMenu) {
    menuButton.addEventListener("click", () => {
        navMenu.classList.toggle("open");
        menuButton.classList.toggle("open");
        menuButton.innerHTML = menuButton.classList.contains("open") ? "✖" : "☰";
    });
}
