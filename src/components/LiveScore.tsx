'use client'
import * as z from 'zod'

import { dataIsObject, hasApiErrors, ParseUnion } from "@/lib/client-utils"
import { FetchState } from "@/types/fetchState"
import { LiveFixture } from "@/types/football"
import { isFinished, isLive } from "@/lib/match-status"
import { CircleAlert } from "lucide-react"
import { useEffect, useState } from "react"

const POLL_INTERVAL_MS = 2000;

const LiveResponseSchema = z.array(z.object({
    fixture: z.object({
        status: z.object({
            short: z.string(),
            long: z.string(),
            elapsed: z.number().nullable()
        })
    }),
    goals: z.object({
        home: z.number().nullable(),
        away: z.number().nullable()
    })
}));

const parseResponse = (data: unknown): ParseUnion<LiveFixture> => {
    if (!dataIsObject(data)) {
        return { ok: false, error: 'Unexpected response format'};
    }
    if (hasApiErrors(data.errors)) {
        return { ok: false, error: 'The API returned an error'};
    }
    const parsedResponse = LiveResponseSchema.safeParse(data.response);
    if (!parsedResponse.success) {
        return { ok: false, error: 'Unexpected response format'};
    }
    if (parsedResponse.data.length === 0) {
        return { ok: false, error: 'Match not found'};
    }
    const first = parsedResponse.data[0];
    return {
        ok: true,
        data: {
            goals: {
                home: first.goals.home,
                away: first.goals.away
            },
            minute: first.fixture.status.elapsed,
            short: first.fixture.status.short,
            long: first.fixture.status.long
        },
    }
}

export default function LiveScore({ fixtureId }: { fixtureId: number }) {
    const [state, setState] = useState<FetchState<LiveFixture>>({ status: 'loading'})

     useEffect(() => {
        const controller = new AbortController();

        let timeout: ReturnType<typeof setTimeout>;

        async function load() {
            try {
                const res = await fetch(`/api/live/${fixtureId}`, { signal: controller.signal });
                if (!res.ok) {
                    setState({ status: 'error', error: 'There was an error fetching the match' });
                    return;
                }
                const data: unknown = await res.json();
                const parsedResponse = parseResponse(data);
                if (!parsedResponse.ok) {
                    setState({ status: 'error', error: parsedResponse.error });
                    return;
                }
                setState({ status: 'success', data: parsedResponse.data })
            } catch {
                if (!controller.signal.aborted) {
                    setState({ status: 'error', error: 'There was an error calling the API' });
                }
                return;
            }

            timeout = setTimeout(load, POLL_INTERVAL_MS);
        }

        load();

        return () => {
            controller.abort();
            clearTimeout(timeout);
        }
    }, [fixtureId])

    return (
        <section
            aria-label="Live score"
            aria-busy={state.status === 'loading'}
            className="flex flex-col items-center justify-center gap-4 min-h-40 px-6 py-8
            bg-surface border border-line rounded-card"
        >
            {state.status === 'success' ?
            <>
                <StatusBadge fixture={state.data} />
                <Score fixture={state.data} />
            </>
            : state.status === 'error' ?
            <div role="alert" className="flex flex-col items-center gap-1 text-center">
                <CircleAlert size={20} aria-hidden="true" className="mb-1 text-ink-3" />
                <p className="text-[15px] font-bold text-ink">Live score unavailable</p>
                <p className="text-sm text-ink-2">{state.error}</p>
            </div>
            : <ScoreSkeleton />}
        </section>
    )
}

// Same footprint as the loaded state, so the card doesn't jump when data arrives.
function ScoreSkeleton() {
    return (
        <>
            <span className="sr-only">Loading live score…</span>
            <span aria-hidden="true" className="w-36 h-8 rounded-full bg-field motion-safe:animate-pulse" />
            <span aria-hidden="true" className="w-44 h-14 rounded-control bg-field motion-safe:animate-pulse" />
        </>
    );
}

function StatusBadge({ fixture }: { fixture: LiveFixture }) {
    const { short, long, minute } = fixture;
    const live = isLive(short);
    // At half-time the API keeps elapsed at 45: "HT" reads better than a frozen minute.
    const clock = short === 'HT' ? 'HT' : minute !== null ? `${minute}'` : null;

    return (
        <span className="inline-flex items-center gap-2 h-8 px-3 rounded-full bg-field border border-line text-sm">
            {live && <span className="w-2 h-2 rounded-full bg-live motion-safe:animate-pulse" aria-hidden="true" />}
            {live && clock && <span className="font-bold text-live-ink tabular-nums">{clock}</span>}
            {isFinished(short) && <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">{short}</span>}
            <span className="font-medium text-ink-2">{long}</span>
        </span>
    );
}

function Score({ fixture }: { fixture: LiveFixture }) {
    const { goals, short } = fixture;
    const color = isLive(short) ? 'text-live-ink' : 'text-ink';

    // Only the score is announced to screen readers: the minute changes on every poll and would be noise.
    return (
        <p aria-live="polite" aria-atomic="true" className={`font-display font-extrabold text-5xl sm:text-6xl tabular-nums ${color}`}>
            {goals.home ?? '–'}
            <span className="mx-3 text-ink-3" aria-hidden="true">-</span>
            <span className="sr-only"> to </span>
            {goals.away ?? '–'}
        </p>
    );
}