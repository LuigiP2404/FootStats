import LiveScore from "@/components/LiveScore";
import { notFound } from "next/navigation";

export default async function Page({ params }: PageProps<"/match/[id]">) {
    const { id } = await params;
    const fixtureId = Number(id);

    if (!Number.isInteger(fixtureId) || fixtureId <= 0) {
        notFound();
    }


    return (
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-7">
            <LiveScore fixtureId={fixtureId} />
        </main>
    );
}