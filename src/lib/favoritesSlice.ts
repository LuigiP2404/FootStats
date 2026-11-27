import type { FavoriteTeam } from "@/types/football";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

type StoreFavorites = {
    items: FavoriteTeam[],
    hydrated: boolean
}

const initialState: StoreFavorites = {
    items: [],
    hydrated: false
};

export const lsFieldName = 'favoriteItems';

export const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addFavorite: (state, action: PayloadAction<FavoriteTeam>) => {
            if (!state.items.some((x) => x.id === action.payload.id)) {
                state.items.push(action.payload)
            }
        },
        removeFavorite: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((x) => x.id !== action.payload)
        },
        toggleFavorite: (state, action: PayloadAction<FavoriteTeam>) => {
            if (!state.items.some((x) => x.id === action.payload.id)) {
                state.items.push(action.payload);
            } else {
                state.items = state.items.filter((x) => x.id !== action.payload.id)
            }
        },
        setFavorites: (state, action: PayloadAction<FavoriteTeam[]>) => {
            return {
                hydrated: true,
                items: action.payload
            }
        }
    }
})

export const selectFavorites = (state: RootState) => state.favorites.items;
export const selectFavoritesHydrated = (state: RootState) => state.favorites.hydrated;

export default favoritesSlice.reducer;
export const { addFavorite, removeFavorite, toggleFavorite, setFavorites } = favoritesSlice.actions