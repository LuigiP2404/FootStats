"use client"

import { useEffect, useId, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";

// Minimal shape the dropdown needs. Move it to src/types once the API response is typed.
type TeamResult = {
    id: number;
    name: string;
    code: string | null;
    country: string;
};

type Status = "idle" | "loading" | "done" | "error";

const MIN_CHARS = 3;
const MAX_RESULTS = 8;

export default function Search() {
    const router = useRouter();
    const id = useId();
    const inputId = `${id}-input`;
    const listboxId = `${id}-listbox`;
    const optionId = (team: TeamResult) => `${id}-option-${team.id}`;

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<TeamResult[]>([]);
    const [status, setStatus] = useState<Status>("idle");
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    useEffect(() => {
        if (query.trim().length < MIN_CHARS) return;
        const controller = new AbortController();
        const timeoutId = setTimeout(async () => {
            setStatus("loading");
            try {
                // TODO: fetch your route handler here (pass controller.signal),
                // then setResults() with the teams it returns.
                setResults([]);
                setStatus("done");
            } catch {
                if (!controller.signal.aborted) setStatus("error");
            }
        }, 500);

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [query]);

    const visible = results.slice(0, MAX_RESULTS);
    const showPanel = isOpen && query.trim().length >= MIN_CHARS;
    const activeTeam = activeIndex >= 0 ? visible[activeIndex] : undefined;

    const goToTeam = (team: TeamResult) => {
        setIsOpen(false);
        setQuery('');
        router.push(`/team/${team.id}`);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!showPanel) return;
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, visible.length - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, -1));
                break;
            case "Enter":
                if (activeTeam) {
                    e.preventDefault();
                    goToTeam(activeTeam);
                }
                break;
            case "Escape":
                setIsOpen(false);
                break;
        }
    };

    return (
        <div className="relative w-56">
            <label htmlFor={inputId} className="sr-only">Search teams</label>
            <div className="flex items-center gap-2 h-10 px-3 rounded-control bg-field border border-line
                focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/25">
                <SearchIcon size={16} aria-hidden="true" className="shrink-0 text-ink-3" />
                <input
                    id={inputId}
                    type="search"
                    role="combobox"
                    aria-expanded={showPanel}
                    aria-controls={listboxId}
                    aria-autocomplete="list"
                    aria-activedescendant={activeTeam ? optionId(activeTeam) : undefined}
                    autoComplete="off"
                    placeholder="Search teams"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        setActiveIndex(-1);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setIsOpen(false)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent text-sm text-ink placeholder:text-ink-3 outline-none"
                />
            </div>

            {showPanel && (
                <div className="absolute right-0 top-full z-20 mt-2 w-80 overflow-hidden
                    bg-surface border border-line rounded-card">
                    <ul id={listboxId} role="listbox" aria-label="Teams" className="max-h-80 overflow-y-auto">
                        {visible.map((team, index) => (
                            <li
                                key={team.id}
                                id={optionId(team)}
                                role="option"
                                aria-selected={index === activeIndex}
                                // Keep focus on the input so onBlur doesn't close the panel before the click lands.
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => goToTeam(team)}
                                onMouseEnter={() => setActiveIndex(index)}
                                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer
                                    border-b border-divider last:border-b-0
                                    ${index === activeIndex ? "bg-subtle" : ""}`}
                            >
                                <span className="grid place-items-center w-7 h-7 shrink-0 rounded-chip
                                    bg-field border border-line font-display font-bold text-[9px] text-ink-2">
                                    {team.code ?? team.name.slice(0, 3).toUpperCase()}
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate text-sm font-semibold text-ink">{team.name}</span>
                                    <span className="block text-xs text-ink-3">{team.country}</span>
                                </span>
                            </li>
                        ))}
                    </ul>

                    <p role="status" className="px-4 py-3 empty:p-0 text-sm text-ink-3">
                        {status === "loading" && "Searching…"}
                        {status === "error" && "Something went wrong. Try again."}
                        {status === "done" && visible.length === 0 && "No teams found."}
                    </p>
                </div>
            )}
        </div>
    );
}
