import "server-only";
import type { Player, PlayerPosition } from "@/types/football";
import { seededRandom } from "@/lib/random";

// Generated, deterministic player pool for the filterable list (PREP day 2).
// Large on purpose: the list must be heavy enough to make re-renders visible in the Profiler.
export const PLAYER_COUNT = 2500;

const FIRST_NAMES = [
    "Luca", "Marco", "Alessandro", "Matteo", "Lorenzo", "Federico", "Davide", "Andrea", "Giovanni", "Riccardo",
    "James", "Jack", "Harry", "Oliver", "George", "Thomas", "Daniel", "Samuel", "Joseph", "William",
    "Carlos", "Diego", "Javier", "Sergio", "Pablo", "Alvaro", "Raul", "Iker", "Marcos", "Hugo",
    "Lucas", "Mathis", "Antoine", "Kylian", "Ousmane", "Theo", "Maxime", "Jules", "Raphael", "Adrien",
    "Leon", "Jonas", "Florian", "Kai", "Niklas", "Joshua", "Leroy", "Timo", "Serge", "Julian",
    "Joao", "Bruno", "Rafael", "Bernardo", "Ruben", "Vitinha", "Gabriel", "Rodrygo", "Vinicius", "Endrick",
];

const LAST_NAMES = [
    "Rossi", "Bianchi", "Romano", "Colombo", "Ricci", "Marino", "Greco", "Bruno", "Gallo", "Conti",
    "Smith", "Jones", "Taylor", "Brown", "Walker", "Wright", "Robinson", "Thompson", "White", "Hughes",
    "Garcia", "Martinez", "Lopez", "Sanchez", "Perez", "Gomez", "Fernandez", "Ruiz", "Diaz", "Moreno",
    "Martin", "Bernard", "Dubois", "Durand", "Lefebvre", "Mercier", "Fontaine", "Girard", "Lambert", "Rousseau",
    "Muller", "Schmidt", "Schneider", "Fischer", "Weber", "Wagner", "Becker", "Hoffmann", "Koch", "Richter",
    "Silva", "Santos", "Oliveira", "Pereira", "Costa", "Rodrigues", "Almeida", "Carvalho", "Ferreira", "Gomes",
];

const NATIONALITIES = ["Italy", "England", "Spain", "France", "Germany", "Portugal", "Brazil", "Argentina", "Netherlands", "Belgium"];

export const TEAMS = [
    { id: 489, name: "AC Milan" }, { id: 505, name: "Inter" }, { id: 496, name: "Juventus" }, { id: 492, name: "Napoli" },
    { id: 497, name: "AS Roma" }, { id: 487, name: "Lazio" }, { id: 499, name: "Atalanta" }, { id: 502, name: "Fiorentina" },
    { id: 33, name: "Manchester United" }, { id: 50, name: "Manchester City" }, { id: 40, name: "Liverpool" }, { id: 42, name: "Arsenal" },
    { id: 49, name: "Chelsea" }, { id: 47, name: "Tottenham" }, { id: 66, name: "Aston Villa" }, { id: 34, name: "Newcastle" },
    { id: 541, name: "Real Madrid" }, { id: 529, name: "Barcelona" }, { id: 530, name: "Atletico Madrid" }, { id: 536, name: "Sevilla" },
    { id: 157, name: "Bayern Munich" }, { id: 165, name: "Borussia Dortmund" }, { id: 168, name: "Bayer Leverkusen" }, { id: 173, name: "RB Leipzig" },
    { id: 85, name: "Paris Saint Germain" }, { id: 81, name: "Marseille" }, { id: 80, name: "Lyon" }, { id: 91, name: "Monaco" },
];

// Rough real-world squad split: few keepers, more defenders and midfielders.
const POSITIONS: { position: PlayerPosition; weight: number }[] = [
    { position: "Goalkeeper", weight: 0.1 },
    { position: "Defender", weight: 0.33 },
    { position: "Midfielder", weight: 0.34 },
    { position: "Attacker", weight: 0.23 },
];

function pick<T>(items: readonly T[], random: () => number): T {
    return items[Math.floor(random() * items.length)];
}

function pickPosition(random: () => number): PlayerPosition {
    let roll = random();
    for (const { position, weight } of POSITIONS) {
        if (roll < weight) return position;
        roll -= weight;
    }
    return "Midfielder";
}

function int(min: number, max: number, random: () => number) {
    return min + Math.floor(random() * (max - min + 1));
}

function generatePlayers(): Player[] {
    const random = seededRandom(2024);
    return Array.from({ length: PLAYER_COUNT }, (_, i) => {
        const position = pickPosition(random);
        const appearances = int(0, 38, random);
        // Attackers score more, keepers basically never.
        const goalRate = { Goalkeeper: 0, Defender: 0.06, Midfielder: 0.18, Attacker: 0.45 }[position];
        const goals = Math.round(appearances * goalRate * random() * 2);
        const assists = Math.round(appearances * (position === "Goalkeeper" ? 0.01 : 0.15) * random() * 2);

        return {
            id: 100_000 + i,
            name: `${pick(FIRST_NAMES, random)} ${pick(LAST_NAMES, random)}`,
            age: int(17, 38, random),
            nationality: pick(NATIONALITIES, random),
            position,
            shirtNumber: position === "Goalkeeper" ? pick([1, 12, 13, 25, 99], random) : int(2, 99, random),
            team: pick(TEAMS, random),
            season: {
                appearances,
                goals,
                assists,
                rating: appearances === 0 ? 0 : Math.round((5.8 + random() * 2.2) * 10) / 10,
            },
        };
    });
}

// Computed once per server process, then reused.
const players = generatePlayers();

export function getPlayers(): Player[] {
    return players;
}
