import SidebarLink from "./ui/SidebarLink";

export default function Sidebar() {
    return (
        <div className="sidebar bg-surface w-100 h-dvh fixed left-0 top-sidebar border-r border-line px-8 py-2 hidden lg:block">
            <h2 className="text-ink-2 uppercase mt-2">Competitions</h2>
            <div className="flex flex-col">
                <SidebarLink href="#" text="Serie A" games={5} image="https://media.api-sports.io/football/leagues/2.png"/>
                <SidebarLink href="#" text="Premier League" games={15} image="https://media.api-sports.io/football/leagues/2.png"/>
                <SidebarLink href="#" text="La Liga" games={1} image="https://media.api-sports.io/football/leagues/2.png"/>
                <SidebarLink href="#" text="Bundesliga" games={1} image="https://media.api-sports.io/football/leagues/2.png"/>
            </div>
            <h2 className="text-ink-2 uppercase mt-20">Favorites</h2>
            <div className="flex flex-col">
                <SidebarLink href="#" text="Serie A" games={5} image="https://media.api-sports.io/football/leagues/2.png"/>
                <SidebarLink href="#" text="Premier League" games={15} image="https://media.api-sports.io/football/leagues/2.png"/>
                <SidebarLink href="#" text="La Liga" games={1} image="https://media.api-sports.io/football/leagues/2.png"/>
                <SidebarLink href="#" text="Bundesliga" games={1} image="https://media.api-sports.io/football/leagues/2.png"/>
            </div>
        </div>
    )
}