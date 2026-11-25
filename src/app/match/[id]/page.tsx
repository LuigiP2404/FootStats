import LiveScore from "@/components/LiveScore";
import { isPositiveInteger } from "@/lib/validation";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const fixtureId = Number(id);

    if (!isPositiveInteger(fixtureId)) notFound();

    return (
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-7">
            <LiveScore fixtureId={fixtureId} />
        </main>
    );
}