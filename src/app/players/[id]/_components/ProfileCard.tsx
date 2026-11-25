import type { ReactNode } from "react";

// Card shell shared by the real sections and their Suspense fallbacks,
// so the skeleton has exactly the same frame and nothing jumps when data streams in.
export function ProfileCard({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="bg-surface border border-line rounded-card overflow-hidden">
            <h2 className="px-5 py-3 border-b border-line text-[15px] font-bold text-ink">{title}</h2>
            {children}
        </section>
    );
}

export function ProfileCardSkeleton({ title, rows = 3 }: { title: string; rows?: number }) {
    return (
        <ProfileCard title={title}>
            <span className="sr-only">Loading {title.toLowerCase()}…</span>
            <ul aria-hidden="true" className="divide-y divide-divider">
                {Array.from({ length: rows }, (_, i) => (
                    <li key={i} className="flex items-center gap-3 px-5 py-3">
                        <span className="w-8 h-8 rounded-chip bg-field motion-safe:animate-pulse" />
                        <span className="flex flex-col gap-1.5 flex-1">
                            <span className="w-2/3 h-3.5 rounded-full bg-field motion-safe:animate-pulse" />
                            <span className="w-1/3 h-3 rounded-full bg-field motion-safe:animate-pulse" />
                        </span>
                    </li>
                ))}
            </ul>
        </ProfileCard>
    );
}

export function EmptyState({ children }: { children: ReactNode }) {
    return <p className="px-5 py-8 text-center text-sm text-ink-2">{children}</p>;
}
