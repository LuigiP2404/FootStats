// Dates travel through the URL as "YYYY-MM-DD" strings (the same format <input type="date"> uses).

export function toIsoDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

// new Date("2025-09-20") is parsed as UTC midnight, which can shift the day in some timezones.
// Building it from its parts keeps it in local time.
export function fromIsoDate(value: string): Date {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
}

export function isIsoDate(value: unknown): value is string {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

const timeFormatter = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });

// API-Football timestamps are Unix seconds, Date wants milliseconds.
export function getTimeFromTimestamp(value: number): string {
    return timeFormatter.format(new Date(value * 1000));
}

export function addDays(value: string, days: number): string {
    const date = fromIsoDate(value);
    date.setDate(date.getDate() + days);
    return toIsoDate(date);
}