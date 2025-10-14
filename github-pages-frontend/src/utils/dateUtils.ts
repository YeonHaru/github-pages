export function getClockByMinutes() {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
}

export function getClockBySeconds() {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

export function getDateString() {
    const date = new Date();
    const year = date.getFullYear();
    const month =  String(date.getMonth() + 1).padStart(2, "0");
    const day =  String(date.getDate()).padStart(2, "0");
    const weekdayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRID", "SAT"];
    const weekday = weekdayNames[date.getDay()];

    return `${year}. ${month}. ${day}. ${weekday}`;
}