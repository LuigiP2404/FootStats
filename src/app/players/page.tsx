import PlayerList from "@/components/PlayerList";
import { getPlayers } from "@/mocks/players";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Footstats | Players',
  description: 'A list of players',
}

export default async function Players() {
    const players = getPlayers();

    return (
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-7">
            <h1 className="mb-6 text-[22px] sm:text-[28px] font-display font-extrabold text-ink">
                Players
            </h1>
            <PlayerList players={players} />
        </main>
    );
}