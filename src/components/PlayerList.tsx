"use client"

import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { Player, PlayerPosition } from "@/types/football";
import { memo, useState, useTransition } from "react";
import Pagination from "./ui/Pagination";

{ /* not needed, but I decided to keep this here in order to motivate PREP.md measurements about profiler stats */ }
const PlayerResultMemo = memo(PlayerResults);
const PlayerRowMemo = memo(PlayerRow);

// Shared by the header row and every player row, so the columns always line up.
// Mobile keeps player / goals / rating; the other columns appear from `sm`.
const ROW_GRID = "grid grid-cols-[1fr_2.5rem_3rem] sm:grid-cols-[1fr_3rem_3rem_3.5rem_3rem_3rem_3.5rem] items-center gap-3";

const PAGE_SIZE = 15;

const POSITION_SHORT: Record<PlayerPosition, string> = {
    Goalkeeper: "GK",
    Defender: "DF",
    Midfielder: "MF",
    Attacker: "FW",
};

export default function PlayerList({ players }: { players: Player[] }) {
    const [query, setQuery] = useState<string>('');
    const [isPending, startTransition] = useTransition();
    const [filterQuery, setFilterQuery] = useState<string>('');
    const [page, setPage] = useState<number>(1);

    return(
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
                <label htmlFor="search" className="sr-only">Search players</label>
                <div className="flex items-center gap-2 h-11 px-3 w-full sm:w-80 rounded-control bg-field border border-line
                    focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/25">
                    <SearchIcon size={16} aria-hidden="true" className="shrink-0 text-ink-3" />
                    <input
                        id="search"
                        type="search"
                        autoComplete="off"
                        placeholder="Search by name"
                        value={query}
                        onChange={(e) => {
                            const val = e.target.value;
                            setQuery(val);
                            { /* not needed, but I decided to keep this here in order to motivate PREP.md measurements about profiler stats */ }
                            startTransition(() => {
                                setFilterQuery(val);
                                setPage(1);
                            })
                        }}
                        className="w-full bg-transparent text-sm text-ink placeholder:text-ink-3 outline-none"
                    />
                </div>
                
                <p aria-live="polite" className="text-sm text-ink-3">
                    {isPending ? "Updating…" : null}
                </p>
            </div>

            <div className={`transition-opacity ${isPending ? "opacity-60" : "opacity-100"}`}>
                <PlayerResultMemo players={players} query={filterQuery} page={page} onPageChangeFn={setPage} />
            </div>
        </div>
    );
}

function PlayerResults({ players, query, page, onPageChangeFn }: { players: Player[], query: string, page: number, onPageChangeFn(page: number): void }) {
    const filteredPlayers = players.filter((x) => {
        return x.name.toLowerCase().includes(query.trim().toLowerCase());
    })
    const visiblePlayers = filteredPlayers.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
    
     const props = {
        page: page,
        totalPages: Math.ceil(filteredPlayers.length / PAGE_SIZE),
        onPageChange: onPageChangeFn,
        label: "Players pagination",
    }

    return(
        <section aria-label="Players" className="bg-surface border border-line rounded-card overflow-hidden">
            <header className="flex items-center justify-between px-5 py-3 bg-subtle border-b border-line">
                <h2 className="text-[15px] font-bold text-ink">All players</h2>
                <p className="text-sm text-ink-2 tabular-nums">
                    {filteredPlayers.length} {filteredPlayers.length === 1 ? "player" : "players"}
                </p>
            </header>

            {visiblePlayers.length > 0 ? (
                <>
                    {/* Visual column headers; each row link carries its own full aria-label. */}
                    <div aria-hidden="true" className={`${ROW_GRID} px-5 py-2.5 border-b border-divider
                        text-[11px] font-semibold uppercase tracking-wider text-ink-3`}>
                        <span>Player</span>
                        <span className="hidden sm:block text-center">Pos</span>
                        <span className="hidden sm:block text-right">Age</span>
                        <span className="hidden sm:block text-right">Apps</span>
                        <span className="text-right">G</span>
                        <span className="hidden sm:block text-right">A</span>
                        <span className="text-right">Rating</span>
                    </div>

                    <ul className="divide-y divide-divider">
                        {visiblePlayers.map((x) => {
                            return <PlayerRowMemo key={x.id} player={x} />
                        })}
                    </ul>
                </>
            ) : (
                <p className="px-5 py-10 text-center text-sm text-ink-2">
                    No players match &ldquo;{query.trim()}&rdquo;.
                </p>
            )}
            <Pagination {...props} />
        </section>
    );
}

function PlayerRow({ player } : { player: Player }) {
    const { id, name, age, nationality, position, team, season } = player;
    const rating = season.appearances > 0 ? season.rating.toFixed(1) : "–";
    // One string instead of sr-only spans per cell: keeps the DOM small across 2,500 rows.
    const label = `${name}, ${team.name}, ${position}, age ${age}, ${season.appearances} appearances, `
        + `${season.goals} goals, ${season.assists} assists, rating ${rating}`;

    return (
        <li className="hover:bg-subtle">
            <Link
                href={`/players/${id}`}
                aria-label={label}
                className={`${ROW_GRID} px-5 py-3 text-sm tabular-nums
                focus-visible:outline-2 focus-visible:outline-accent focus-visible:-outline-offset-2`}
            >
                <span className="flex flex-col min-w-0">
                    <span className="font-semibold text-ink truncate">{name}</span>
                    <span className="text-[12.5px] text-ink-3 truncate">{team.name} · {nationality}</span>
                </span>
                <span className="hidden sm:block justify-self-center px-1.5 py-0.5 rounded-chip bg-field
                    text-[11px] font-semibold text-ink-2">
                    {POSITION_SHORT[position]}
                </span>
                <span className="hidden sm:block text-right text-ink-2">{age}</span>
                <span className="hidden sm:block text-right text-ink-2">{season.appearances}</span>
                <span className="text-right font-semibold text-ink">{season.goals}</span>
                <span className="hidden sm:block text-right text-ink-2">{season.assists}</span>
                <span className={`text-right font-bold ${season.rating >= 7.5 ? "text-positive" : "text-ink"}`}>
                    {rating}
                </span>
            </Link>
        </li>
    );
}