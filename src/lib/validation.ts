import type { FavoriteTeam } from "@/types/football"
import z from "zod"

const schema = z.array(z.object({
    id: z.number(),
    name: z.string(),
    logo: z.string().nullable()
}))

const isPositiveInteger = (id: number): boolean => {
    return (Number.isInteger(id) && id > 0)
}

const isValidFavoriteTeams = (team: unknown): team is FavoriteTeam[] => {
    const parsed = schema.safeParse(team);
    return parsed.success;
}

export { isPositiveInteger, isValidFavoriteTeams }