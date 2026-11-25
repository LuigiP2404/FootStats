import { ArrowRight } from "lucide-react";
import { getPlayerTransfers } from "@/lib/players";
import { fromIsoDate } from "@/lib/date";
import type { TransferType } from "@/types/football";
import { EmptyState, ProfileCard } from "./ProfileCard";

const monthFormatter = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" });

// Loans stand out; permanent moves stay neutral.
const typeStyle: Record<TransferType, string> = {
    Transfer: "bg-field text-ink-2",
    Loan: "bg-accent-tint text-accent-strong",
    Free: "bg-field text-ink-2",
};

export default async function PlayerTransfers({ playerId }: { playerId: number }) {
    const transfers = await getPlayerTransfers(playerId)

    return (
        <ProfileCard title="Transfers">
            {transfers.length === 0 ? (
                <EmptyState>No transfers recorded.</EmptyState>
            ) : (
                <ol className="divide-y divide-divider">
                    {transfers.map((x) => (
                        <li key={x.date + '-' + x.to.id} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 px-5 py-3">
                            <time dateTime={x.date} className="text-[12.5px] text-ink-3 tabular-nums">
                                {monthFormatter.format(fromIsoDate(x.date))}
                            </time>
                            <span className="flex items-center gap-2 min-w-0 text-sm">
                                <span className="text-ink-2 truncate">{x.from.name}</span>
                                <ArrowRight size={14} aria-label="to" className="shrink-0 text-ink-3" />
                                <span className="font-semibold text-ink truncate">{x.to.name}</span>
                            </span>
                            <span className={`px-2 py-0.5 rounded-chip text-[11px] font-semibold ${typeStyle[x.type]}`}>
                                {x.type}
                            </span>
                        </li>
                    ))}
                </ol>
            )}
        </ProfileCard>
    );
}
