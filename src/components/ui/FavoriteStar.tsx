"use client"

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { Team } from "@/types/football"
import { toggleFavorite } from "@/lib/favoritesSlice";
import { Star } from "lucide-react";
import { toFavoriteTeam } from "@/lib/client-utils";

export default function FavoriteStar({ team }: { team: Team }) {
    const dispatch = useAppDispatch();
    const isFavorite = useAppSelector((state) => state.favorites.some((x) => x.id === team.id));

    return (
        <button
            type="button"
            aria-pressed={isFavorite}
            aria-label={`${isFavorite ? 'Remove' : 'Add'} ${team.name} ${isFavorite ? 'from' : 'to'} favorites.`}
            onClick={() => dispatch(toggleFavorite(toFavoriteTeam(team)))}
            className={`inline-flex shrink-0 items-center justify-center w-10 h-10 rounded-control transition-colors
                hover:bg-field focus-visible:outline-2 focus-visible:outline-accent focus-visible:-outline-offset-2
                ${isFavorite ? "text-accent" : "text-ink-3 hover:text-ink-2"}`}
        >
            <Star
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                className={isFavorite ? "fill-current" : "fill-none"}
            />
        </button>
    );
}