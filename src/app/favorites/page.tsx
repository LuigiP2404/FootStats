import type { Metadata } from "next";
import FavoritesGrid from "./_components/FavoritesGrid";

export const metadata: Metadata = {
    title: 'Footstats | Favorites',
    description: 'A list of favorite teams',
}

export default function Page() {
    return(
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-7">
            <h1 className="mb-6 text-[22px] sm:text-[28px] font-display font-extrabold text-ink">
                Favorites
            </h1>
            <FavoritesGrid />
        </main>
    )
}
