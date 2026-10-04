// Import the expanded 8-item restaurant dataset from the same script folder
import { foodSpots } from './data.js';

// Function 1: Core Template Literal layout constructor for Buka Cards
function createBukaCard(spot) {
    return `
        <div class="buka-card">
            <img src="images/placeholder.jpg" data-src="${spot.image}" alt="${spot.name}" class="lazy-image" loading="lazy">
            <div class="buka-info">
                <h3>${spot.name}</h3>
                <p><strong>📍 Location:</strong> ${spot.location}</p>
                <p><strong>🍲 Specialty:</strong> ${spot.specialty}</p>
                <p><strong>🚗 Parking:</strong> ${spot.parking}</p>
                <p class="rating"><strong>⭐ Rating:</strong> ${spot.rating} / 5.0</p>
                <button class="save-btn" data-id="${spot.id}">❤️ Bookmark Buka</button>
            </div>
        </div>
    `;
}

// Function 2: Conditional filtering and dynamic DOM element modification
function renderBukaGrid(filterMode = 'featured') {
    const gridContainer = document.getElementById('buka-grid');
    if (!gridContainer) return; // Guard clause if element doesn't exist on current page

    gridContainer.innerHTML = ''; // Clear existing content

    // Array filtering and conditional matching branching
    const displayList = filterMode === 'featured'
        ? foodSpots.filter(spot => spot.featured)
        : foodSpots;

    // Loop and append elements using template literals
    displayList.forEach(spot => {
        gridContainer.innerHTML += createBukaCard(spot);
    });

    // Initialize interactive actions and performance engines for newly generated items
    initializeBookmarks();
    initLazyLoading();
}

// Function 3: Event Listeners & LocalStorage Data Persistence
function initializeBookmarks() {
    const buttons = document.querySelectorAll('.save-btn');
    buttons.forEach(button => {
        button.removeEventListener('click', handleBookmarkClick); // Prevent duplicate attachments
        button.addEventListener('click', handleBookmarkClick);
    });
}

function handleBookmarkClick(e) {
    const id = e.target.getAttribute('data-id');
    let bookmarks = JSON.parse(localStorage.getItem('bukaBookmarks')) || [];

    if (!bookmarks.includes(id)) {
        bookmarks.push(id);
        localStorage.setItem('bukaBookmarks', JSON.stringify(bookmarks));
        alert('Buka saved to your local exploration list!');
    } else {
        alert('This spot is already bookmarked.');
    }
}

// Function 4: Active IntersectionObserver Lazy Loading for optimized performance
function initLazyLoading() {
    const images = document.querySelectorAll('.lazy-image');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Swap placeholder for real downloaded webp food image asset
                    img.src = img.getAttribute('data-src');
                    img.classList.add('loaded');
                    obs.unobserve(img);
                }
            });
        });
        images.forEach(img => observer.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => img.src = img.getAttribute('data-src'));
    }
}

// Global initialization setup once content is ready
document.addEventListener('DOMContentLoaded', () => {
    // Dynamic footer metrics updates
    const yearSpan = document.getElementById('currentYear');
    const modifiedSpan = document.getElementById('lastModified');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    if (modifiedSpan) modifiedSpan.textContent = document.lastModified;

    // Render initial spotlight grid setup
    renderBukaGrid('featured');

    // Filter interactive change listener
    const toggleFilter = document.getElementById('filter-toggle');
    if (toggleFilter) {
        toggleFilter.addEventListener('change', (e) => {
            renderBukaGrid(e.target.value);
        });
    }
});
