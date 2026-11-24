// API-Football short status codes, grouped by how the UI should render them.
// Shared by server and client components, so no "server-only" here.

const LIVE_STATUSES = new Set(["1H", "HT", "2H", "ET", "BT", "P", "SUSP", "INT", "LIVE"]);
const FINISHED_STATUSES = new Set(["FT", "AET", "PEN"]);
const NOT_PLAYED_STATUSES = new Set(["PST", "CANC", "ABD", "AWD", "WO"]);

export const isLive = (status: string) => LIVE_STATUSES.has(status);
export const isFinished = (status: string) => FINISHED_STATUSES.has(status);
export const isNotPlayed = (status: string) => NOT_PLAYED_STATUSES.has(status);
