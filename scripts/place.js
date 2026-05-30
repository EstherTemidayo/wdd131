// 1. Dynamic Footer Data Tracking
document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = `Last Modification: ${document.lastModified}`;

// 2. Wind Chill Calculation Specification Setup
// Static values matching our HTML input fields
const temperatureCelsius = 31;
const windSpeedKmh = 14;

// Function to calculate metric wind chill value
function calculateWindChill(temp, speed) {
    // Specification check limits: Temp must be <= 10°C AND Wind Speed must be > 4.8 km/h
    if (temp <= 10 && speed > 4.8) {
        // Official Metric Formula: Twc = 13.12 + 0.6215*T - 11.37*V^0.16 + 0.3965*T*V^0.16
        const chill = 13.12 + (0.6215 * temp) - (11.37 * Math.pow(speed, 0.16)) + (0.3965 * temp * Math.pow(speed, 0.16));
        return `${Math.round(chill)}°C`;
    } else {
        // Returns N/A if weather states are outside specific formula limits
        return "N/A";
    }
}

// Execute calculation and display output on page render layout
const windChillElement = document.getElementById("windChill");
windChillElement.textContent = calculateWindChill(temperatureCelsius, windSpeedKmh);
