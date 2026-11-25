import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
    // 1-based: the first page is 1.
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    // Accessible name of the <nav> landmark, e.g. "Players pagination".
    label?: string;
};

// `aria-disabled` instead of `disabled`: a disabled button loses focus (it jumps to <body>),
// so a keyboard user pressing Next up to the last page would be thrown back to the top of the document.
const buttonStyle = `inline-flex items-center gap-1.5 h-9 px-3 rounded-control
    bg-surface border border-line text-sm font-semibold text-ink-2
    hover:bg-subtle hover:text-ink
    aria-disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:hover:bg-surface aria-disabled:hover:text-ink-2
    focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2`;

// Presentational only: it does not own the page state, it just reports clicks.
export default function Pagination({ page, totalPages, onPageChange, label = "Pagination" }: Props) {
    if (totalPages <= 1) return null;

    const isFirst = page <= 1;
    const isLast = page >= totalPages;

    return (
        <nav aria-label={label} className="flex items-center justify-between gap-3 px-5 py-3 border-t border-line bg-subtle">
            <button
                type="button"
                // Still focusable, but ignored at the edge (aria-disabled does not block clicks by itself).
                onClick={() => { if (!isFirst) onPageChange(page - 1); }}
                aria-disabled={isFirst}
                className={buttonStyle}
            >
                <ChevronLeft size={16} aria-hidden="true" />
                <span>Prev</span>
            </button>

            <p className="text-sm text-ink-2 tabular-nums" aria-live="polite">
                Page <span className="font-semibold text-ink">{page}</span> of {totalPages}
            </p>

            <button
                type="button"
                onClick={() => { if (!isLast) onPageChange(page + 1); }}
                aria-disabled={isLast}
                className={buttonStyle}
            >
                <span>Next</span>
                <ChevronRight size={16} aria-hidden="true" />
            </button>
        </nav>
    );
}
