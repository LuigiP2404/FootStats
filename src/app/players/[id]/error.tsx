"use client"
// Error boundaries must be Client Components: they catch errors thrown while rendering
// on the client and need an onClick handler for the retry button.

import { CircleAlert } from "lucide-react";
import Link from "next/link";

// Catches unexpected errors in this route (e.g. the API failing).
// notFound() is not an error: it is handled by not-found.tsx, never by this file.
export default function PlayerError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-7">
            <section
                role="alert"
                className="flex flex-col items-center gap-3 px-6 py-12 text-center bg-surface border border-line rounded-card"
            >
                <CircleAlert size={24} aria-hidden="true" className="text-ink-3" />
                <h1 className="text-[15px] font-bold text-ink">This player could not be loaded</h1>
                <p className="text-sm text-ink-2">
                    Something went wrong on our side. Try again in a moment.
                    {/* In production the real message is hidden; the digest matches the server log entry. */}
                    {error.digest ? <span className="block mt-1 text-xs text-ink-3">Error ID: {error.digest}</span> : null}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {/* reset() re-renders the segment: useful for transient failures. */}
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center h-11 px-4 rounded-control bg-accent text-accent-ink font-semibold text-sm
                        focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                    >
                        Try again
                    </button>
                    <Link
                        href="/players"
                        className="inline-flex items-center h-11 px-4 rounded-control bg-surface text-ink-2 border border-line font-semibold text-sm
                        focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                    >
                        Back to players
                    </Link>
                </div>
            </section>
        </main>
    );
}
