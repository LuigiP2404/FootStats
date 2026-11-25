import { ProfileCardSkeleton } from "./_components/ProfileCard";

// Shown while the page awaits the player (first visit to an id, before it is cached).
// Next wraps page.tsx in <Suspense fallback={<Loading />}> automatically.
// Same layout as the profile (back link, header, stat cards, two sections), so nothing jumps.
export default function Loading() {
    return (
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-7" aria-busy="true">
            <span className="sr-only">Loading player…</span>

            <div aria-hidden="true">
                <span className="block w-24 h-4 mb-6 rounded-full bg-field motion-safe:animate-pulse" />

                <div className="flex items-center gap-4 mb-6">
                    <span className="w-16 h-16 rounded-card bg-field motion-safe:animate-pulse" />
                    <span className="flex flex-col gap-2">
                        <span className="w-48 h-7 rounded-control bg-field motion-safe:animate-pulse" />
                        <span className="w-64 h-4 rounded-control bg-field motion-safe:animate-pulse" />
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[0, 1, 2, 3].map((i) => (
                        <span key={i} className="h-19.5 rounded-stat bg-surface border border-line motion-safe:animate-pulse" />
                    ))}
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 items-start">
                <ProfileCardSkeleton title="Transfers" rows={3} />
                <ProfileCardSkeleton title="Trophies" rows={3} />
            </div>
        </main>
    );
}
