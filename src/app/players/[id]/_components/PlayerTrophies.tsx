import { Trophy } from "lucide-react";
import { getPlayerTrophies } from "@/lib/players";
import { EmptyState, ProfileCard } from "./ProfileCard";

export default async function PlayerTrophies({ playerId }: { playerId: number }) {
    const trophies = await getPlayerTrophies(playerId)

    return (
        <ProfileCard title="Trophies">
            {trophies.length === 0 ? (
                <EmptyState>No trophies yet.</EmptyState>
            ) : (
                <ul className="divide-y divide-divider">
                    {trophies.map((x) => {
                        const won = x.place === "Winner";
                        return (
                            <li key={x.competition + '-'  + x.season + '-'  + x.place} className="flex items-center gap-3 px-5 py-3">
                                <span
                                    aria-hidden="true"
                                    className={`grid place-items-center shrink-0 w-8 h-8 rounded-chip
                                    ${won ? "bg-accent-tint text-accent-strong" : "bg-field text-ink-3"}`}
                                >
                                    <Trophy size={16} />
                                </span>
                                <span className="flex flex-col flex-1 min-w-0">
                                    <span className="text-sm font-semibold text-ink truncate">{x.competition}</span>
                                    <span className="text-[12.5px] text-ink-3 truncate">{x.country} · {x.season}</span>
                                </span>
                                <span className={`text-xs font-semibold ${won ? "text-accent-strong" : "text-ink-2"}`}>
                                    {x.place}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </ProfileCard>
    );
}
