"use client"
import { lsFieldName, selectFavorites, selectFavoritesHydrated, setFavorites } from "@/lib/favoritesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { isValidFavoriteTeams } from "@/lib/validation";
import type { FavoriteTeam } from "@/types/football";
import { useEffect } from "react";

export default function FavoritesSync() {
    const dispatch = useAppDispatch();
    const favorites = useAppSelector(selectFavorites);
    const hydrated = useAppSelector(selectFavoritesHydrated);
    
    useEffect(() => {
        let favoritesArr: FavoriteTeam[] = [];
        try {
            const favoriteTeamsLS = localStorage.getItem(lsFieldName);
            if (favoriteTeamsLS) {
                const favoritesParsed = JSON.parse(favoriteTeamsLS);
                if (isValidFavoriteTeams(favoritesParsed)) {
                    favoritesArr = favoritesParsed;
                } else {
                    console.error("The user's favorite teams data has a wrong format");
                    localStorage.removeItem(lsFieldName);
                }
            }
        } catch {
            console.error("There was an error fetching the user's favorite teams");
        }
        dispatch(setFavorites(favoritesArr));
    }, [dispatch]);

    useEffect(() => {
        if (!hydrated) {
            return;
        }
        try {
            localStorage.setItem(lsFieldName, JSON.stringify(favorites));
        } catch {
            console.error("There was an error setting the user's favorite teams");
        }
    }, [hydrated,favorites])
    
    return null;
}