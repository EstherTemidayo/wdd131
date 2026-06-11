document.addEventListener("DOMContentLoaded", () => {
    // Get existing value or fallback to 0
    let reviewCount = parseInt(localStorage.getItem("reviewSubmissionCount")) || 0;

    // Increment tracker counter state
    reviewCount += 1;

    // Save updated count back to local storage
    localStorage.setItem("reviewSubmissionCount", reviewCount);

    // Render back into current document view using template literal layout rules
    document.getElementById("reviewCounter").textContent = `${reviewCount}`;

    // Handle standard footer data fields
    document.getElementById("currentYear").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = document.lastModified;
});
