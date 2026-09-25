import Link from "next/link";
import Image from "next/image";
import { FixtureInfo, League } from "@/types/football";
import { getTimeFromTimestamp } from "@/lib/date";

type Props = {
    league: League;
    matches: FixtureInfo[];
};

// API-Football short status codes, grouped by how a row should render them.
const LIVE_STATUSES = new Set(["1H", "HT", "2H", "ET", "BT", "P", "SUSP", "INT", "LIVE"]);
const FINISHED_STATUSES = new Set(["FT", "AET", "PEN"]);
const NOT_PLAYED_STATUSES = new Set(["PST", "CANC", "ABD", "AWD", "WO"]);

const isLive = (status: string) => LIVE_STATUSES.has(status);
const isFinished = (status: string) => FINISHED_STATUSES.has(status);
const isNotPlayed = (status: string) => NOT_PLAYED_STATUSES.has(status);

function MatchStatus({ match }: { match: FixtureInfo }) {
    const { status, timestamp } = match.fixture;

    if (isLive(status.short)) {
        return (
            <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-live" aria-hidden="true" />
                <span className="text-xs font-bold text-live-ink tabular-nums">
                    {status.short === "HT" ? "HT" : `${status.elapsed ?? ""}'`}
                </span>
            </span>
        );
    }
    if (isFinished(status.short) || isNotPlayed(status.short)) {
        return <span className="text-xs font-semibold uppercase text-ink-3">{status.short}</span>;
    }
    return <span className="text-xs font-medium text-ink-2 tabular-nums">{getTimeFromTimestamp(timestamp)}</span>;
}

function MatchScore({ match }: { match: FixtureInfo }) {
    const { status } = match.fixture;
    const { home, away } = match.goals;
    const hasScore = (isLive(status.short) || isFinished(status.short)) && home !== null && away !== null;

    if (!hasScore) {
        return <span className="text-ink-3">–</span>;
    }
    return (
        <span className={`font-display font-bold text-base tabular-nums ${isLive(status.short) ? "text-live-ink" : "text-ink"}`}>
            {home} - {away}
        </span>
    );
}

// winner is null until the match is decided (and on a draw).
const teamNameStyle = (winner: boolean | null) =>
    winner === true ? "font-bold text-ink" : winner === false ? "font-medium text-ink-2" : "font-medium text-ink";

function TeamLogo({ src }: { src: string | null }) {
    // Decorative: the team name is always rendered next to it.
    return src
        ? <Image src={src} alt="" width={20} height={20} className="shrink-0 object-contain" />
        : <span className="shrink-0 w-5 h-5 rounded-chip bg-field" aria-hidden="true" />;
}

export default function LeagueBox({ league, matches }: Props) {
    return (
        <section className="bg-surface border border-line rounded-card overflow-hidden">
            <header className="flex items-center gap-3 px-5 py-3 bg-subtle border-b border-line">
                <Image
                    src={league.flag ?? league.logo}
                    alt=""
                    width={20}
                    height={20}
                    className="shrink-0 object-contain"
                />
                <div className="flex items-baseline gap-3 flex-1 min-w-0">
                    <h2 className="text-[15px] font-bold text-ink truncate">{league.name}</h2>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-3 truncate">{league.country}</p>
                </div>
                <Link
                    href={`/competition/${league.id}`}
                    className="shrink-0 text-sm font-semibold text-accent-strong hover:underline
                    rounded-nav focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                >
                    Standings
                </Link>
            </header>

            <ul className="divide-y divide-divider">
                {matches.map((match) => {
                    const { fixture, teams } = match;
                    return (
                        <li key={fixture.id} className="flex items-center hover:bg-subtle">
                            <Link
                                href={`/match/${fixture.id}`}
                                className="flex-1 min-w-0 grid grid-cols-[3.5rem_1fr_4rem_1fr] items-center gap-3 px-5 py-3
                                focus-visible:outline-2 focus-visible:outline-accent focus-visible:-outline-offset-2"
                            >
                                <MatchStatus match={match} />

                                <span className="flex items-center justify-end gap-2.5 min-w-0">
                                    <span className={`text-sm truncate ${teamNameStyle(teams.home.winner)}`}>
                                        {teams.home.name}
                                    </span>
                                    <TeamLogo src={teams.home.logo} />
                                </span>

                                <span className="text-center">
                                    <MatchScore match={match} />
                                </span>

                                <span className="flex items-center gap-2.5 min-w-0">
                                    <TeamLogo src={teams.away.logo} />
                                    <span className={`text-sm truncate ${teamNameStyle(teams.away.winner)}`}>
                                        {teams.away.name}
                                    </span>
                                </span>
                            </Link>
                            {/* Favorite toggle goes here, as a sibling of the Link (client component). */}
                            <span className="w-10 shrink-0" aria-hidden="true" />
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
