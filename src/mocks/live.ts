import "server-only";
import type { ApiResponse, FixtureInfo } from "@/types/football";
import data from "@/mocks/fixtures.raw.json";

// Simulates a live match on top of a real fixture from fixtures.raw.json.
// Stateless on purpose: the match clock is derived from Date.now(), so every request
// (and every serverless instance) agrees on the score without keeping anything in memory.

// Raw JSON from our own capture script: trusted, so a cast is acceptable here (unlike data from the network).
const fixtures = data as ApiResponse<FixtureInfo>;

// Accelerated clock: 1 real second = 1 match minute. One full cycle, then the match restarts.
const FIRST_HALF_END = 45;
const HALFTIME_END = FIRST_HALF_END + 15;
const SECOND_HALF_END = HALFTIME_END + 45;
const CYCLE = SECOND_HALF_END + 20; // 20s of "Match Finished" before kick-off again

type Goal = { minute: number; side: "home" | "away" };

// Tiny seeded PRNG (mulberry32): the same fixture id always produces the same goals.
function seededRandom(seed: number) {
    let a = seed;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function goalsFor(fixtureId: number): Goal[] {
    const random = seededRandom(fixtureId);
    const count = Math.floor(random() * 6); // 0..5 goals
    return Array.from({ length: count }, () => ({
        minute: 1 + Math.floor(random() * 90),
        side: random() < 0.5 ? ("home" as const) : ("away" as const),
    }));
}

function countGoals(goals: Goal[], upToMinute: number) {
    const scored = goals.filter((g) => g.minute <= upToMinute);
    return {
        home: scored.filter((g) => g.side === "home").length,
        away: scored.filter((g) => g.side === "away").length,
    };
}

// Where the match is right now. The id offsets the clock so different matches are at different minutes.
function clockFor(fixtureId: number, now: number) {
    const t = (Math.floor(now / 1000) + fixtureId) % CYCLE;
    if (t < FIRST_HALF_END) return { short: "1H", long: "First Half", elapsed: t + 1 };
    if (t < HALFTIME_END) return { short: "HT", long: "Halftime", elapsed: 45 };
    if (t < SECOND_HALF_END) return { short: "2H", long: "Second Half", elapsed: 46 + (t - HALFTIME_END) };
    return { short: "FT", long: "Match Finished", elapsed: 90 };
}

// Same envelope API-Football returns for GET /fixtures?id=...
// An unknown id is not an HTTP error there: it is a 200 with an empty `response`.
export function getLiveFixture(fixtureId: number, now = Date.now()): ApiResponse<FixtureInfo> {
    const base = fixtures.response.find((f) => f.fixture.id === fixtureId);
    const envelope = {
        get: "fixtures",
        parameters: { id: String(fixtureId) },
        errors: [],
        paging: { current: 1, total: 1 },
    };
    if (!base) return { ...envelope, results: 0, response: [] };

    const clock = clockFor(fixtureId, now);
    const goals = goalsFor(fixtureId);
    const current = countGoals(goals, clock.elapsed);
    const halftime = clock.short === "1H" ? { home: null, away: null } : countGoals(goals, 45);
    // Like the real API: `winner` stays null while playing and on a draw.
    const isDecided = clock.short === "FT" && current.home !== current.away;

    const fixture: FixtureInfo = {
        ...base,
        fixture: {
            ...base.fixture,
            status: { short: clock.short, long: clock.long, elapsed: clock.elapsed, extra: null },
        },
        goals: current,
        teams: {
            home: { ...base.teams.home, winner: isDecided ? current.home > current.away : null },
            away: { ...base.teams.away, winner: isDecided ? current.away > current.home : null },
        },
        score: {
            ...base.score,
            halftime,
            fulltime: clock.short === "FT" ? current : { home: null, away: null },
        },
    };
    return { ...envelope, results: 1, response: [fixture] };
}
