import type { FavoriteTeam } from "@/types/football";
import FavoriteStar from "./FavoriteStar";
import TeamLogo from "./TeamLogo";
import Link from "next/link";

export default function FavoriteCard({ team }: { team: FavoriteTeam}) {
    return(
        // Narrow (default): stacked and centered, star pinned top-right.
        // Wide (@min-xs): single row, star back in the flow at the end.
        <article className="relative flex flex-col items-center gap-2.5 h-full px-3 pt-5 pb-4
        bg-surface border border-line rounded-card
        @min-xs:flex-row @min-xs:gap-3 @min-xs:p-3">
            <span className="grid place-items-center w-14 h-14 shrink-0 rounded-control bg-subtle
            @min-xs:w-10 @min-xs:h-10">
                <TeamLogo src={team.logo} />
            </span>
            <Link
                href={`/team/${team.id}`}
                className="w-full min-w-0 truncate text-center text-[15px] font-bold text-ink rounded-chip
                hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
                @min-xs:w-auto @min-xs:flex-1 @min-xs:text-left"
            >
                {team.name}
            </Link>
            <div className="absolute top-1.5 right-1.5 @min-xs:static">
                <FavoriteStar team={team} />
            </div>
        </article>
    )
}
