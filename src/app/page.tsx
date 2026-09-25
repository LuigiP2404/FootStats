import FilterButton from "@/components/ui/FilterButton";
import DatePicker from "@/components/ui/DatePicker";
import LeagueBox from "@/components/ui/LeagueBox";
import { addDays, fromIsoDate, isIsoDate, toIsoDate } from "@/lib/date";
import { ApiResponse, FixtureInfo, LeagueGroup } from "@/types/football";
import data from "@/mocks/fixtures.raw.json";

const fixtures = data as ApiResponse<FixtureInfo>;

const titleFormatter = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });

function groupByLeague(matches: FixtureInfo[]): LeagueGroup[] {
    const groups = new Map<number, LeagueGroup>();
    for (const match of matches) {
        const group = groups.get(match.league.id);
        if (group) {
            group.matches.push(match);
        } else {
            groups.set(match.league.id, { league: match.league, matches: [match] });
        }
    }
    return [...groups.values()];
}

export default async function Page({ searchParams }: PageProps<"/">) {
    const { date } = await searchParams;
    const today = toIsoDate(new Date());
    const selectedDate = isIsoDate(date) ? date : today;

    const quickDates = [
        { label: "Yesterday", value: addDays(today, -1) },
        { label: "Today", value: today },
        { label: "Tomorrow", value: addDays(today, 1) },
    ];
    const quickDate = quickDates.find((d) => d.value === selectedDate);
    const title = quickDate
        ? `${quickDate.label}'s matches`
        : `Matches · ${titleFormatter.format(fromIsoDate(selectedDate))}`;

    const leagueGroups = groupByLeague(fixtures.response);

    return (
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-7">
            <div className="flex flex-wrap items-center gap-3 mb-7">
                <h1 className="flex-1 basis-full sm:basis-auto text-[22px] sm:text-[28px] font-display font-extrabold text-ink">
                    {title}
                </h1>
                <nav aria-label="Quick dates" className="flex items-center h-11 p-1 rounded-control bg-field border border-line">
                    {quickDates.map((d) => (
                        <FilterButton
                            key={d.value}
                            href={`?date=${d.value}`}
                            text={d.label}
                            isActive={d.value === selectedDate}
                        />
                    ))}
                </nav>
                <DatePicker value={selectedDate} />
            </div>

            {leagueGroups.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {leagueGroups.map((group) => (
                        <LeagueBox key={group.league.id} league={group.league} matches={group.matches} />
                    ))}
                </div>
            ) : (
                <p className="px-5 py-10 text-center text-sm text-ink-2 bg-surface border border-line rounded-card">
                    No matches on this day.
                </p>
            )}
        </main>
    );
}
