import type { Metadata } from "next";
import { getPlayer } from "@/lib/players";
import { isPositiveInteger } from "@/lib/validation";
import { notFound } from "next/navigation";
import PlayerTransfers from "./_components/PlayerTransfers";
import PlayerTrophies from "./_components/PlayerTrophies";
import { ProfileCardSkeleton } from "./_components/ProfileCard";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const revalidate = 86400; // 1d
export const dynamicParams = true;

export async function generateStaticParams() {
    return []
}

// Runs before the page for the same request. getPlayer is wrapped in React `cache`,
// so the page reuses this result instead of loading the player a second time.
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const normalizedId = Number(id);
    // Invalid or unknown ids: the page itself calls notFound(), here we only need a sensible title.
    const player = isPositiveInteger(normalizedId) ? await getPlayer(normalizedId) : null;
    if (!player) {
        return { title: "Footstats | Player not found" };
    }

    return {
        title: `Footstats | ${player.name}`,
        description: `${player.name}, ${player.position.toLowerCase()} at ${player.team.name}: `
            + `${player.season.goals} goals and ${player.season.assists} assists in ${player.season.appearances} appearances this season.`,
    };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const normalizedId = Number(id);

    if (!isPositiveInteger(normalizedId)) notFound();

    const playerData = await getPlayer(normalizedId);
    if (!playerData) notFound();


    const { name, age, nationality, position, shirtNumber, team, season } = playerData;
    const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    const stats = [
        { label: "Appearances", value: season.appearances },
        { label: "Goals", value: season.goals },
        { label: "Assists", value: season.assists },
        { label: "Rating", value: season.appearances > 0 ? season.rating.toFixed(1) : "–", highlight: season.rating >= 7.5 },
    ];

    return(
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-7">
            <Link
                href="/players"
                className="inline-flex items-center gap-1 mb-5 text-sm font-semibold text-ink-2 hover:text-ink
                rounded-nav focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
                <ChevronLeft size={16} aria-hidden="true" />
                All players
            </Link>

            <header className="flex items-center gap-4 mb-6">
                {/* Initials placeholder, like the team crests: no real photos in the portfolio. */}
                <span
                    aria-hidden="true"
                    className="grid place-items-center shrink-0 w-16 h-16 rounded-card bg-accent text-accent-ink
                    font-display font-extrabold text-xl"
                >
                    {initials}
                </span>
                <div className="min-w-0">
                    <h1 className="flex items-baseline gap-2 text-[22px] sm:text-[28px] font-display font-extrabold text-ink">
                        <span className="truncate">{name}</span>
                        <span className="shrink-0 text-base font-sans font-semibold text-ink-3 tabular-nums">#{shirtNumber}</span>
                    </h1>
                    <p className="text-[13px] text-ink-2 truncate">
                        {team.name} · {position} · {nationality} · {age} years
                    </p>
                </div>
            </header>

            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="flex flex-col gap-1 px-4 py-3 bg-surface border border-line rounded-stat">
                        <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">{stat.label}</dt>
                        <dd className={`font-display font-extrabold text-[23px] sm:text-[26px] tabular-nums
                            ${stat.highlight ? "text-positive" : "text-ink"}`}>
                            {stat.value}
                        </dd>
                    </div>
                ))}
            </dl>

            {/* Secondary sections stream in independently; the player above already decided the 404. */}
            <div className="grid gap-4 lg:grid-cols-2 items-start">
                <Suspense fallback={<ProfileCardSkeleton title="Transfers" rows={3} />}>
                    <PlayerTransfers playerId={normalizedId} />
                </Suspense>
                <Suspense fallback={<ProfileCardSkeleton title="Trophies" rows={3} />}>
                    <PlayerTrophies playerId={normalizedId} />
                </Suspense>
            </div>
        </main>
    )
}