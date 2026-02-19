import { fetchNextHoliday } from "./api.js";
import { calculateTimeLeft, formatValue } from "./countdown.js";

const countryButtons = document.querySelectorAll(".country-btn");
const holidayNameEl = document.querySelector(".holiday-name");
const holidayDateEl = document.querySelector(".holiday-date");
const loadingEl = document.querySelector(".loading");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

let currentHoliday = null;
let countdownInterval = null;

function showLoading() {
    loadingEl.classList.remove("hidden");
    holidayNameEl.textContent = "";
    holidayDateEl.textContent = "";
    daysEl.textContent = "--";
    hoursEl.textContent = "--";
    minutesEl.textContent = "--";
    secondsEl.textContent = "--";
}

function hideLoading() {
    loadingEl.classList.add("hidden");
}

function updateCountdown() {
    if (!currentHoliday) return;

    const timeLeft = calculateTimeLeft(currentHoliday.date);

    daysEl.textContent = formatValue(timeLeft.days);
    hoursEl.textContent = formatValue(timeLeft.hours);
    minutesEl.textContent = formatValue(timeLeft.minutes);
    secondsEl.textContent = formatValue(timeLeft.seconds);
}

function displayHoliday(holiday) {
    const date = new Date(holiday.date + "T00:00:00");
    holidayNameEl.textContent = holiday.name;
    holidayDateEl.textContent = date.toLocaleDateString("cs-CZ", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

async function selectCountry(countryCode) {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    showLoading();

    try {
        const holiday = await fetchNextHoliday(countryCode);
        currentHoliday = holiday;

        hideLoading();
        displayHoliday(holiday);
        updateCountdown();

        countdownInterval = setInterval(updateCountdown, 1000);
    } catch (error) {
        hideLoading();
        holidayNameEl.textContent = "Chyba při načítání";
        console.error(error);
    }
}

countryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        countryButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        selectCountry(btn.dataset.country);
    });
});

selectCountry("CZ");
