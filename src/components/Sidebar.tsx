import SidebarLink from "./ui/SidebarLink";

const LEAGUE_LOGO = "https://media.api-sports.io/football/leagues/2.png";

export default function Sidebar() {
    return (
        // Header is h-15 (60px): the sidebar sticks right below it and fills the rest of the viewport.
        <aside className="hidden lg:block w-60 shrink-0 sticky top-15 h-[calc(100dvh-3.75rem)] overflow-y-auto
        bg-surface border-r border-line px-3 py-5">
            <nav aria-labelledby="sidebar-competitions">
                <h2 id="sidebar-competitions" className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-ink-3">
                    Competitions
                </h2>
                <ul className="flex flex-col gap-0.5">
                    <li><SidebarLink href="#" text="Serie A" games={10} image={LEAGUE_LOGO} /></li>
                    <li><SidebarLink href="#" text="Premier League" games={6} image={LEAGUE_LOGO} /></li>
                    <li><SidebarLink href="#" text="La Liga" games={8} image={LEAGUE_LOGO} /></li>
                    <li><SidebarLink href="#" text="Bundesliga" games={5} image={LEAGUE_LOGO} /></li>
                </ul>
            </nav>
            <nav aria-labelledby="sidebar-favorites" className="mt-6">
                <h2 id="sidebar-favorites" className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-ink-3">
                    Favorites
                </h2>
                <ul className="flex flex-col gap-0.5">
                    <li><SidebarLink href="#" text="Napoli" image={LEAGUE_LOGO} /></li>
                    <li><SidebarLink href="#" text="Inter" image={LEAGUE_LOGO} /></li>
                </ul>
            </nav>
        </aside>
    )
}
