import { NextRequest } from "next/server";
import { getLiveFixture } from "@/mocks/live";

// Dev-only switches to exercise the client's edge cases:
//   ?delay=3000      slow response (test aborting an in-flight request when the match changes)
//   ?fail=http       HTTP 502 (network/upstream failure)
//   ?fail=api        HTTP 200 with a filled `errors` object (how API-Football reports quota/key errors)
//   ?malformed=1     200 with a payload of the wrong shape (test runtime validation)
const MAX_DELAY_MS = 10_000;

// Mocks are the default, so the free-tier quota is never spent by accident.
const USE_MOCKS = process.env.USE_MOCKS !== "false";

const wait = (ms: number, signal: AbortSignal) =>
    new Promise<void>((resolve) => {
        const timeoutId = setTimeout(resolve, ms);
        // If the client aborts, stop waiting instead of holding the request open.
        signal.addEventListener("abort", () => {
            clearTimeout(timeoutId);
            resolve();
        });
    });

export async function GET(req: NextRequest, ctx: RouteContext<"/api/live/[id]">) {
    const { id } = await ctx.params;
    const fixtureId = Number(id);
    if (!Number.isInteger(fixtureId) || fixtureId <= 0) {
        return Response.json({ error: "Invalid fixture id" }, { status: 400 });
    }

    if (!USE_MOCKS) {
        return Response.json({ error: "Live API not wired yet" }, { status: 501 });
    }

    const params = req.nextUrl.searchParams;
    const delay = Math.min(Number(params.get("delay")) || 0, MAX_DELAY_MS);
    if (delay > 0) await wait(delay, req.signal);

    // Live data must never be cached, neither by the browser nor by a CDN.
    const headers = { "Cache-Control": "no-store" };

    const fail = params.get("fail");
    if (fail === "http") {
        return Response.json({ error: "Upstream unavailable" }, { status: 502, headers });
    }
    if (fail === "api") {
        const body = { ...getLiveFixture(fixtureId), results: 0, response: [], errors: { requests: "You have reached the request limit for the day" } };
        return Response.json(body, { headers });
    }
    if (params.has("malformed")) {
        const body = { ...getLiveFixture(fixtureId), response: [{ fixture: { id: fixtureId }, goals: { home: "2", away: null } }] };
        return Response.json(body, { headers });
    }

    return Response.json(getLiveFixture(fixtureId), { headers });
}
