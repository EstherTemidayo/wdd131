// Form processing and storage handler for join.html
document.addEventListener('DOMContentLoaded', () => {
    // Dynamic footer metrics update
    const yearSpan = document.getElementById('currentYear');
    const modifiedSpan = document.getElementById('lastModified');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    if (modifiedSpan) modifiedSpan.textContent = document.lastModified;

    // Form data persistence listener
    const form = document.getElementById('bukaForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const newSpot = {
                name: document.getElementById('bukaName').value,
                location: document.getElementById('bukaLocation').value + ", Lagos",
                specialty: document.getElementById('bukaSpecialty').value,
                parking: document.getElementById('bukaParking').value
            };

            // Save user recommendation to localStorage
            let submissions = JSON.parse(localStorage.getItem('userBukaSubmissions')) || [];
            submissions.push(newSpot);
            localStorage.setItem('userBukaSubmissions', JSON.stringify(submissions));

            alert(`Thank you! "${newSpot.name}" has been registered into local storage database memory successfully.`);
            form.reset();
        });
    }
});
