import { fetchNextHoliday } from "./api.js";
import { calculateTimeLeft, pad } from "./countdown.js";

const buttons = document.querySelectorAll(".country-btn");
const holidayName = document.getElementById("holiday-name");
const holidayDate = document.getElementById("holiday-date");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

let currentHoliday = null;
let timer = null;

function updateCountdown() {
    if (!currentHoliday) return;

    const time = calculateTimeLeft(currentHoliday.date);
    daysEl.textContent = pad(time.days);
    hoursEl.textContent = pad(time.hours);
    minutesEl.textContent = pad(time.minutes);
    secondsEl.textContent = pad(time.seconds);
}

async function selectCountry(code) {
    if (timer) clearInterval(timer);

    holidayName.textContent = "Načítám...";
    holidayDate.textContent = "";
    daysEl.textContent = "--";
    hoursEl.textContent = "--";
    minutesEl.textContent = "--";
    secondsEl.textContent = "--";

    const holiday = await fetchNextHoliday(code);
    currentHoliday = holiday;

    holidayName.textContent = holiday.name;
    const date = new Date(holiday.date + "T00:00:00");
    holidayDate.textContent = date.toLocaleDateString("cs-CZ", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    updateCountdown();
    timer = setInterval(updateCountdown, 1000);
}

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectCountry(btn.dataset.country);
    });
});

selectCountry("CZ");
