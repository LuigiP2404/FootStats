"use server"

import { revalidatePath } from "next/cache";
import z from "zod";

type RefreshPlayerReturn =
| { ok: true }
| { ok: false, error: string}

export async function refreshPlayer(playerId: unknown): Promise<RefreshPlayerReturn> {
    const isDevToolsEnabled = process.env.ENABLE_DEV_TOOLS === 'true';
    if (!isDevToolsEnabled) {
        return {
            ok: false,
            error: 'Unable to refresh the player data'
        }
    }
    const isPosInt = z.number().int().positive().safeParse(playerId);
    if (!isPosInt.success) {
        return {
                ok: false,
                error: 'Invalid playerId'
            };
    }
    revalidatePath(`/players/${isPosInt.data}`);
    return {
        ok: true
    }
}