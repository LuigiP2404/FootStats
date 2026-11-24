import { ApiResponse, TeamResponse } from "@/types/football";
import "server-only";

// API Utils

const baseAuth = () => {
    const apiKey = process.env.FOOTBALL_API_KEY;

    if (!apiKey) {
        throw new Error('Football Api-Key was not found');
    }

    return apiKey;
}

const fetchRounds = async () => {
    const apiKey = baseAuth();
    try {
        const res = await fetch(`${process.env.FOOTBALL_API_BASE_PATH}/fixtures?date=2026-09-18`, {
            headers: {
                "x-apisports-key": apiKey
            }
        })
        if (res && res.ok) return await res.json();
    } catch (err) {
        console.error(err);
    }
}

const fetchTeams = async (input: string, signal: AbortSignal): Promise<ApiResponse<TeamResponse> | undefined> => {
    const apiKey = baseAuth();
    try {
        if (signal.aborted) return;
        const str = encodeURIComponent(input);
        const res = await fetch(`${process.env.FOOTBALL_API_BASE_PATH}/teams?search=${str}`, {
            headers: {
                "x-apisports-key": apiKey
            },
            next: { revalidate: 86400 },
            signal
        })
        if (res && res.ok) return await res.json(); 
        if (!res.ok) throw new Error('Generic API error');
    } catch (err) {
        if (signal.aborted) return;
        throw new Error('There was an error calling the API' + err);
    }
}

const hasApiErrors = (errors: unknown): boolean => {
    return !(errors && typeof errors === 'object' && Object.keys(errors).length === 0);
}

// Data format Utils

// const normalizeNames = (input: string) => {
//     return input.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
// } 

export { fetchRounds, fetchTeams, hasApiErrors };