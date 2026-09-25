"use client"

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DayPicker, type ChevronProps } from "react-day-picker";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { fromIsoDate, toIsoDate } from "@/lib/date";

const formatter = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });

// Swap the library's default chevrons for the lucide icons used across the app.
function NavChevron({ orientation }: ChevronProps) {
    return orientation === "left"
        ? <ChevronLeft size={16} aria-hidden="true" />
        : <ChevronRight size={16} aria-hidden="true" />;
}

export default function DatePicker({ value }: { value: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const selected = fromIsoDate(value);

    // While open: close on click outside and on Escape (returning focus to the trigger).
    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (e: PointerEvent) => {
            if (!wrapperRef.current?.contains(e.target as Node)) setIsOpen(false);
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            setIsOpen(false);
            triggerRef.current?.focus();
        }

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, [isOpen]);

    const handleSelect = (date: Date) => {
        setIsOpen(false);
        triggerRef.current?.focus();
        router.push(`${pathname}?date=${toIsoDate(date)}`);
    }

    return (
        <div ref={wrapperRef} className="relative">
            <button
                ref={triggerRef}
                type="button"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                aria-label={`Choose date, currently ${formatter.format(selected)}`}
                className="inline-flex items-center gap-2 h-11 px-4 rounded-control
                bg-surface text-ink border border-line font-semibold text-sm
                hover:bg-subtle"
                onClick={() => setIsOpen(open => !open)}
            >
                <Calendar size={16} aria-hidden="true" className="text-ink-2" />
                <span className="tabular-nums">{formatter.format(selected)}</span>
            </button>

            {isOpen && (
                <div
                    role="dialog"
                    aria-label="Choose date"
                    className="absolute right-0 top-full mt-2 z-20 p-3
                    bg-surface border border-line rounded-card"
                >
                    <DayPicker
                        mode="single"
                        required
                        autoFocus
                        selected={selected}
                        defaultMonth={selected}
                        onSelect={handleSelect}
                        weekStartsOn={1}
                        showOutsideDays
                        components={{ Chevron: NavChevron }}
                        classNames={{
                            months: "relative",
                            month_caption: "flex items-center h-9 px-2 font-display font-bold text-ink",
                            nav: "absolute top-0 right-0 flex gap-1",
                            button_previous: "grid place-items-center w-9 h-9 rounded-control text-ink-2 hover:bg-subtle",
                            button_next: "grid place-items-center w-9 h-9 rounded-control text-ink-2 hover:bg-subtle",
                            month_grid: "mt-2 border-collapse",
                            weekday: "w-9 pb-1 text-xs font-semibold uppercase text-ink-3",
                            day: "p-0.5 text-center",
                            day_button: "w-9 h-9 rounded-control text-sm font-medium text-ink tabular-nums hover:bg-subtle",
                            today: "[&>button]:font-bold [&>button]:text-accent-strong",
                            outside: "[&>button]:text-ink-3",
                            // `!` so the selected day wins over the hover and today styles.
                            selected: "[&>button]:bg-accent! [&>button]:text-accent-ink!",
                        }}
                    />
                </div>
            )}
        </div>
    )
}
