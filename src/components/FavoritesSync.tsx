"use client"
import { lsFieldName, setFavorites } from "@/lib/favoritesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { isValidFavoriteTeams } from "@/lib/validation";
import { useEffect, useState } from "react";

export default function FavoritesSync() {
    const dispatch = useAppDispatch();
    const favorites = useAppSelector((state) => state.favorites);
    const [hydrated, setHydrated] = useState<boolean>(false);
    useEffect(() => {
        try {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- TODO: switch to getState()
            setHydrated(true);
            const favoriteTeamsLS = localStorage.getItem(lsFieldName);
            if (favoriteTeamsLS) {
                const favoriteTeams = JSON.parse(favoriteTeamsLS);
                if (isValidFavoriteTeams(favoriteTeams)) {
                    dispatch(setFavorites(favoriteTeams));
                } else {
                    console.error("The user's favorite teams data has a wrong format");
                    localStorage.removeItem(lsFieldName);
                }
            }
        } catch {
            console.error("There was an error fetching the user's favorite teams");
        }
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