import type { FavoriteTeam } from "@/types/football";

const hasApiErrors = (errors: unknown): boolean => {
    return !(errors && typeof errors === 'object' && Object.keys(errors).length === 0);
}

type ParseUnion<T> = 
| { ok: true, data: T }
| { ok: false, error: string}

const dataIsObject = (data: unknown): data is Record<string, unknown> => {
    return (typeof data === 'object' && data !== null)
}

const toFavoriteTeam = (team: FavoriteTeam): FavoriteTeam => {
    const { id, name, logo } = team;
    return { id, name, logo };
}

export { hasApiErrors, dataIsObject, toFavoriteTeam }
export type { ParseUnion }