import type { FavoriteTeam } from "@/types/football";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: FavoriteTeam[] = [];

export const lsFieldName = 'favoriteItems';

export const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addFavorite: (state, action: PayloadAction<FavoriteTeam>) => {
            if (!state.some((x) => x.id === action.payload.id)) {
                state.push(action.payload)
            }
        },
        removeFavorite: (state, action: PayloadAction<number>) => {
            return state.filter((x) => x.id !== action.payload)
        },
        toggleFavorite: (state, action: PayloadAction<FavoriteTeam>) => {
            if (!state.some((x) => x.id === action.payload.id)) {
                state.push(action.payload);
            } else {
                return state.filter((x) => x.id !== action.payload.id)
            }
        },
        setFavorites: (state, action: PayloadAction<FavoriteTeam[]>) => {
            return action.payload;
        }
    }
})

export default favoritesSlice.reducer;
export const { addFavorite, removeFavorite, toggleFavorite, setFavorites } = favoritesSlice.actions