// import "server-only";

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

const fetchTeams = async (input: string, signal: AbortSignal) => {
    const apiKey = baseAuth();
    try {
        if (signal.aborted) return;
        const res = await fetch(`${process.env.FOOTBALL_API_BASE_PATH}/teams?search=${input}`, {
            headers: {
                "x-apisports-key": apiKey
            },
            signal
        })
        if (res && res.ok) console.log(await res.json()); // return await res.json();
    } catch (err) {
        if (signal.aborted) return;
        console.error(err);
    }
}

// Data format Utils

const normalizeNames = (input: string) => {
    return input.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
} 

export { fetchRounds, fetchTeams};