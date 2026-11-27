"use client"
import { useAppSelector } from "@/lib/hooks"
import SidebarLink from "./ui/SidebarLink"
import { selectFavorites, selectFavoritesHydrated } from "@/lib/favoritesSlice"
import Link from "next/link"

export default function SidebarFavorites() {
    const favorites = useAppSelector(selectFavorites);
    const hydrated = useAppSelector(selectFavoritesHydrated);
    if (!hydrated) return null;
    if (favorites.length === 0) return <p className="px-2 py-2 text-[13px] leading-snug text-ink-3">No favorites added</p>
    return (
        <>
            <ul className="flex flex-col gap-0.5">
                { favorites.map((team) => {
                    return <li key={team.id}><SidebarLink href={`/team/${team.id}`} text={team.name} image={team.logo || ""}></SidebarLink></li>
                })}
            </ul>
            <Link
                href="/favorites"
                className="mt-1 flex items-center h-9 px-2 rounded-nav text-[13px] font-semibold text-accent
                hover:bg-subtle hover:text-accent-strong
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
                View all
            </Link>
        </>
    )
}