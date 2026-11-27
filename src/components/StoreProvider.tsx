"use client"

import { makeStore } from "@/lib/store"
import { useState } from "react"
import { Provider } from "react-redux";
import FavoritesSync from "./FavoritesSync";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const [store] = useState(() => makeStore());

    return (
        <Provider store={store}>
            <FavoritesSync />
            {children}
        </Provider>
    )
}