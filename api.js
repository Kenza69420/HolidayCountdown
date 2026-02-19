const API_URL = "https://date.nager.at/api/v3/NextPublicHolidays";

export async function fetchNextHoliday(countryCode) {
    const response = await fetch(`${API_URL}/${countryCode}`);
    const holidays = await response.json();
    return holidays[0];
}
