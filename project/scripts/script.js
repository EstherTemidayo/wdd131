/* ==========================================================================
   TRUB (TransitHub) - Main Application Script
   Author: Temidayo Olukayode E. (Nigeria)
   Course: BYU-I WDD 131
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();

    if (document.getElementById("dynamicAgencies")) {
        initFeaturedAgencies();
    }

    if (document.getElementById("searchForm")) {
        initSearchTracker();
    }

    if (document.getElementById("agencySelect")) {
        initLiveTrackerPage();
    }
});

const agencyData = [
    { name: "Express Transit", verified: true, gps: true, routes: 14, region: "Regional", fare: "₦15,000 flat rate" },
    { name: "InterCity Lines", verified: true, gps: true, routes: 8, region: "National", fare: "₦25,000 flat rate" },
    { name: "Delta Commuters", verified: false, gps: true, routes: 5, region: "Local", fare: "₦8,500 flat rate" },
    { name: "EcoShuttle Nigeria", verified: true, gps: true, routes: 11, region: "Lagos Intra-city", fare: "₦2,500 per hour" }
];

function initNavigation() {
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            mainNav.classList.toggle("open");
            if (mainNav.classList.contains("open")) {
                menuToggle.innerHTML = "✕";
            } else {
                menuToggle.innerHTML = "☰";
            }
        });
    }
}

function initFeaturedAgencies() {
    const container = document.getElementById("dynamicAgencies");
    if (!container) return;

    const topAgencies = agencyData.filter(agency => agency.verified === true);
    displayAgencies(topAgencies, container);
}

function displayAgencies(agenciesList, targetContainer) {
    let htmlContent = "";

    agenciesList.forEach(agency => {
        htmlContent += `
            <div class="agency-preview-card">
                <h3>${agency.name}</h3>
                <div class="tags">
                    <span class="tag verified">✓ Verified</span>
                    <span class="tag gps">${agency.gps ? "📡 Active GPS" : "❌ No GPS"}</span>
                </div>
                <p>Operating context: <strong>${agency.region}</strong> network paths.</p>
                <a href="tracking.html?agency=${encodeURIComponent(agency.name)}" class="text-link">Track Fleet →</a>
            </div>
        `;
    });

    targetContainer.innerHTML = htmlContent;
}

function initSearchTracker() {
    const searchForm = document.getElementById("searchForm");
    if (!searchForm) return;

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const fromValue = document.getElementById("fromLocation").value;
        const toValue = document.getElementById("toLocation").value;
        const dateInput = document.getElementById("travelDate").value;
        const carriage = document.getElementById("carriageType").value;
        const passengerCount = parseInt(document.getElementById("passengers").value) || 1;

        const zones = {
            "Central": { x: 0, y: 0 },
            "North": { x: 0, y: 2.8 },
            "East": { x: 2.2, y: -1 },
            "West": { x: -2, y: 0 }
        };

        let fromZone = "West";
        let toZone = "Central";

        Object.keys(zones).forEach(zone => {
            if (fromValue.includes(zone)) fromZone = zone;
            if (toValue.includes(zone)) toZone = zone;
        });

        let totalCalculatedFare = 0;
        let pricingModelNote = "";
        let travelTimeText = "";

        if (fromValue === toValue) {
            const hours = 3;
            totalCalculatedFare = 2500 * hours * passengerCount;
            travelTimeText = `${hours} Hours (Local Loop)`;
            pricingModelNote = "Calculated via EcoShuttle local hourly rate.";
        } else {
            const dx = zones[toZone].x - zones[fromZone].x;
            const dy = zones[toZone].y - zones[fromZone].y;
            const cardinalDistance = Math.sqrt(dx * dx + dy * dy);

            const estimatedHours = parseFloat((cardinalDistance * 3.5).toFixed(1));
            travelTimeText = `${estimatedHours} Hours estimated transit`;

            if (carriage === "shared") {
                const hiddenHourlyRate = 3500;
                const baseRouteCost = estimatedHours * hiddenHourlyRate;
                totalCalculatedFare = Math.round(baseRouteCost * passengerCount);
                pricingModelNote = "Standard shared corridor transit carriage fare.";
            } else {
                totalCalculatedFare = 100000;
                pricingModelNote = "Private individual vehicle flat rate routing.";
            }
        }

        const currentSearch = {
            from: fromValue,
            to: toValue,
            date: dateInput,
            carriageType: carriage,
            passengers: passengerCount,
            calculatedFare: totalCalculatedFare,
            timestamp: new Date().toLocaleDateString()
        };

        localStorage.setItem("trub_last_search", JSON.stringify(currentSearch));

        const resultContainer = document.getElementById("searchResultDisplay");
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="benefit-item" style="border-left: 4px solid var(--secondary-color); margin-top: 1.5rem; background: #fff; padding: 1.5rem; border-radius: 8px; text-align: left;">
                    <h3 style="color: var(--secondary-color); margin-bottom: 0.5rem;">📋 Booking Fare Calculated</h3>
                    <p>Route: <strong>${fromValue}</strong> ➔ <strong>${toValue}</strong></p>
                    <p>Expected Duration: <strong>${travelTimeText}</strong></p>
                    <p>Total Fare Matrix: <strong style="color: var(--primary-color); font-size: 1.25rem;">₦${totalCalculatedFare.toLocaleString()}</strong></p>
                    <p style="font-size: 0.85rem; color: #666; margin-top: 0.5rem; border-top: 1px dashed #ddd; padding-top: 0.5rem;">*${pricingModelNote}</p>
                </div>
            `;
        }
    });
}

function initLiveTrackerPage() {
    const selector = document.getElementById("agencySelect");
    const dashboard = document.getElementById("trackingDashboard");

    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedAgency = urlParams.get('agency');

    if (preSelectedAgency) {
        const matched = agencyData.find(item => preSelectedAgency.includes(item.name) || item.name.includes(preSelectedAgency));
        if (matched) {
            selector.value = matched.name;
            updateTrackingView(matched.name, dashboard);
        }
    }

    selector.addEventListener("change", (e) => {
        updateTrackingView(e.target.value, dashboard);
    });
}

function updateTrackingView(agencyName, displayContainer) {
    if (!agencyName) {
        displayContainer.innerHTML = `
            <div class="stat-card" style="text-align: left; border-top: 4px solid var(--primary-color); padding: 1.5rem; background:#fff; border-radius:8px;">
                <h3>No Active Fleet Selected</h3>
                <p>Please select an agency from the drop-down selector above to map real-time progress paths.</p>
            </div>`;
        return;
    }

    const matchedFleet = agencyData.find(item => agencyName.includes(item.name) || item.name.includes(agencyName));

    if (!matchedFleet || !matchedFleet.gps) {
        displayContainer.innerHTML = `
            <div class="stat-card" style="text-align: left; border-top: 4px solid #c62828; padding: 1.5rem; background:#fff; border-radius:8px;">
                <h3 style="color: #c62828;">📡 Tracking Offline: ${agencyName}</h3>
                <p>This agency does not currently support active satellite telemetry streams on our marketplace network.</p>
            </div>`;
        return;
    }

    let progressPercent = Math.floor(Math.random() * 30) + 40;
    let etaHours = (Math.random() * 2 + 1).toFixed(1);

    displayContainer.innerHTML = `
        <div class="benefit-item" style="border-left: 4px solid var(--accent-color); padding: 2rem; background: #fff; border-radius: 8px; text-align: left;">
            <h2 style="margin: 0 0 1rem 0;">🛰️ Live Console: ${matchedFleet.name}</h2>
            <div class="tags" style="margin-bottom: 1.5rem; display: flex; gap: 0.5rem;">
                <span class="tag verified" style="background-color: #E8F5E9; color: var(--primary-color); padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: bold; font-size: 0.8rem;">✓ Security Audited</span>
                <span class="tag gps" style="background-color: #FFF8E1; color: #B78103; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: bold; font-size: 0.8rem;">📡 GPS Signal Locked</span>
            </div>
            
            <div style="background: #eec15c20; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem;">
                <p style="margin: 0;"><strong>Active Route Telemetry Status:</strong> Vehicle en route across ${matchedFleet.region} network paths.</p>
            </div>

            <div class="progress-bar-container" style="background: #e0e0e0; border-radius: 10px; height: 12px; width: 100%; margin: 1rem 0; overflow: hidden;">
                <div id="liveProgressBar" style="background: var(--secondary-color, #22A653); height: 100%; width: ${progressPercent}%; transition: width 1s linear;"></div>
            </div>
            
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-top: 1rem;">
                <div id="liveProgressText"><strong>Current Journey Progress:</strong> ${progressPercent}% Completed</div>
`;
}