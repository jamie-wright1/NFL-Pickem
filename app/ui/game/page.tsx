import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { GamePageProps } from "../../lib/definitions";

import './page.css'; // Import CSS file



export default async function Index({ searchParams }: GamePageProps) {
    const resolvedSearchParams = searchParams ? await searchParams : undefined;
    const gameId = resolvedSearchParams?.game_id;
    const gameIdValue = Array.isArray(gameId) ? gameId[0] : gameId;
    const parsedID = gameIdValue ? Number(gameIdValue) : NaN;

    if (!Number.isFinite(parsedID)) {
        notFound();
    }

    redirect(`/ui/game/${parsedID}`);
}