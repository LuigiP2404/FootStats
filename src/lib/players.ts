import "server-only";
import { cache } from "react";
import type { Player, PlayerTransfer, PlayerTrophy } from "@/types/football";
import { getPlayers } from "@/mocks/players";
import { generateTransfers, generateTrophies } from "@/mocks/player-history";

// Data layer for players: pages import from here, never from the mocks directly.
// Today it reads the generated mock; later only this file changes to call API-Football.

// Simulated network latency, so loading states and waterfalls are visible in dev.
// Different on purpose: a slow and a fast endpoint make the difference between
// sequential awaits, Promise.all and <Suspense> streaming measurable.
const MOCK_LATENCY_MS = {
    player: 300,
    transfers: 600,
    trophies: 150,
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Built once: O(1) lookup instead of scanning 2,500 players on every request.
const playersById = new Map(getPlayers().map((player) => [player.id, player]));

// Resolves to null when the id does not exist (the real API answers 200 with an empty `response`).
// Wrapped in React `cache`: generateMetadata and the page both call it during the same render,
// and without it the mock (and later the API) would be hit twice. Only `fetch` is deduplicated automatically.
export const getPlayer = cache(async (id: number): Promise<Player | null> => {
    await wait(MOCK_LATENCY_MS.player);
    return playersById.get(id) ?? null;
});

// Both take just the id, like the real endpoints (/transfers?player=, /trophies?player=):
// they do not need getPlayer's result, so they can run in parallel with it.
// Unknown id → empty list (no error), same as the API.
export const getPlayerTransfers = cache(async (id: number): Promise<PlayerTransfer[]> => {
    await wait(MOCK_LATENCY_MS.transfers);
    const player = playersById.get(id);
    return player ? generateTransfers(player) : [];
});

export const getPlayerTrophies = cache(async (id: number): Promise<PlayerTrophy[]> => {
    await wait(MOCK_LATENCY_MS.trophies);
    const player = playersById.get(id);
    return player ? generateTrophies(player) : [];
});
