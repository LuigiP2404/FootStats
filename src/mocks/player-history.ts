import "server-only";
import type { Player, PlayerTransfer, PlayerTrophy, TransferType } from "@/types/football";
import { seededRandom } from "@/lib/random";
import { TEAMS } from "@/mocks/players";

// Career data derived from the player: deterministic per id, consistent with the player's current team.
// Kept separate from players.ts on purpose: in the real API these are separate endpoints (and separate requests).

const CURRENT_SEASON_START = 2025;

const COMPETITIONS = [
    { competition: "Serie A", country: "Italy" },
    { competition: "Premier League", country: "England" },
    { competition: "La Liga", country: "Spain" },
    { competition: "Bundesliga", country: "Germany" },
    { competition: "Ligue 1", country: "France" },
    { competition: "Coppa Italia", country: "Italy" },
    { competition: "FA Cup", country: "England" },
    { competition: "UEFA Champions League", country: "World" },
    { competition: "UEFA Europa League", country: "World" },
];

const TRANSFER_TYPES: TransferType[] = ["Transfer", "Transfer", "Transfer", "Loan", "Free"];

function pick<T>(items: readonly T[], random: () => number): T {
    return items[Math.floor(random() * items.length)];
}

function seasonLabel(startYear: number) {
    return `${startYear}/${startYear + 1}`;
}

// Newest first, like a career timeline. The last move always lands at the current team.
export function generateTransfers(player: Player): PlayerTransfer[] {
    const random = seededRandom(player.id * 7 + 1);
    // Younger players have moved less.
    const maxMoves = Math.max(0, Math.min(5, Math.floor((player.age - 17) / 3)));
    const count = Math.floor(random() * (maxMoves + 1));

    const transfers: PlayerTransfer[] = [];
    let to = player.team;
    let year = CURRENT_SEASON_START - Math.floor(random() * 2);

    for (let i = 0; i < count; i++) {
        let from = pick(TEAMS, random);
        if (from.id === to.id) from = TEAMS[(TEAMS.indexOf(from) + 1) % TEAMS.length];
        const month = random() < 0.7 ? "07" : "01"; // summer or winter window
        transfers.push({ date: `${year}-${month}-01`, type: pick(TRANSFER_TYPES, random), from, to });
        to = from;
        year -= 1 + Math.floor(random() * 3);
    }
    return transfers;
}

// Newest season first. Many players have won nothing, which is realistic (and tests the empty state).
export function generateTrophies(player: Player): PlayerTrophy[] {
    const random = seededRandom(player.id * 13 + 5);
    const careerYears = Math.max(1, player.age - 18);
    const count = random() < 0.4 ? 0 : Math.floor(random() * Math.min(6, careerYears));

    return Array.from({ length: count }, () => {
        const start = CURRENT_SEASON_START - 1 - Math.floor(random() * careerYears);
        return {
            ...pick(COMPETITIONS, random),
            season: seasonLabel(start),
            place: random() < 0.6 ? ("Winner" as const) : ("Runner-up" as const),
        };
    }).sort((a, b) => b.season.localeCompare(a.season));
}
