import { fetchTeams, hasApiErrors } from "@/lib/utils";
import { NextRequest } from "next/server";

const MIN_CHARS = 3;

export async function GET(nextReq: NextRequest) {
    const q = nextReq.nextUrl.searchParams.get('q');
    if (!q || q.trim().length < MIN_CHARS) {
        return Response.json({ error: 'Invalid query' }, { status: 400 })
    }
    try {
        const data = await fetchTeams(q, nextReq.signal)
        if (data && !hasApiErrors(data.errors)) {
            const map = data.response.map((x) => {
                return {
                    id: x.team.id,
                    name: x.team.name,
                    code: x.team.code,
                    country: x.team.country,
                    logo: x.team.logo
                }
            })
            return Response.json({ response: map }, { status: 200 })
        } else {
            return Response.json({ error: 'Could not retrieve data for ' + q }, { status: 502 })
        }
    } catch (err) {
        return Response.json({ error: 'Could not retrieve data: ' + err }, { status: 502 })
    }
}