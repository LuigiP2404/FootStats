"use client"

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { refreshPlayer } from "../actions";

export default function RefreshPlayerButton({ playerId }: {playerId: number}) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleRefreshClick = () => {
        setError(null);
        startTransition(async () => {
            const result = await refreshPlayer(playerId)
            if (!result.ok) {
                setError(result.error);
                return;
            }
        })
    }

    return (
        <>
            <button
                onClick={handleRefreshClick}
                type="button"
                disabled={isPending}
                className="inline-flex items-center gap-2 h-9 px-3 ml-auto rounded-control
                bg-surface text-ink-2 border border-line font-semibold text-sm
                hover:text-ink disabled:opacity-60 disabled:cursor-wait
                focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
                <RefreshCw size={14} aria-hidden="true" className={isPending ? "animate-spin" : undefined} />
                {isPending ? "Refreshing…" : "Refresh data"}
            </button>
            {/* Always mounted so screen readers announce the message when it appears. */}
            <p role="alert" className="basis-full text-[13px] text-negative empty:hidden">
                {error ? `There was an error refreshing the data: ${error}` : null}
            </p>
        </>
    )
}
