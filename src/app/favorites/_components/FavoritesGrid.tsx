"use client"

import FavoriteCard from "@/components/ui/FavoriteCard";
import { selectFavorites, selectFavoritesHydrated } from "@/lib/favoritesSlice";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";

export default function FavoritesGrid() {
    const favorites = useAppSelector(selectFavorites);
    const favoritesHydrated = useAppSelector(selectFavoritesHydrated)
    if (!favoritesHydrated) {
        return (
            <div role="status">
                <span className="sr-only">Loading favorites…</span>
                <ul aria-hidden="true" className="flex flex-col gap-3">
                    {[0, 1, 2].map((i) => (
                        <li key={i} className="flex items-center gap-3 p-3 bg-surface border border-line rounded-card animate-pulse">
                            <span className="w-10 h-10 shrink-0 rounded-control bg-field" />
                            <span className="h-3.5 w-32 rounded-chip bg-field" />
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
    if (favorites.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center bg-surface border border-line rounded-card">
                <p className="text-[15px] font-bold text-ink">No favorite teams yet</p>
                <p className="text-sm text-ink-2">Tap the star next to a team to keep it here.</p>
                <Link
                    href="/"
                    className="mt-3 inline-flex items-center h-11 px-4 rounded-control bg-accent text-accent-ink font-semibold text-sm
                    hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                    Browse today&apos;s matches
                </Link>
            </div>
        )
    }
    return (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
            { favorites.map((team) => {
                return (
                    <li key={team.id} className="@container">
                        <FavoriteCard team={team} />
                    </li>
                )
            }) }
        </ul>
    );
}