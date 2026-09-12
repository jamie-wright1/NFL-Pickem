import Link from "next/link";
import { notFound } from "next/navigation";

import PickGame from "../../components/pickGame";
import TeamImage from "../../components/teamImage";
import { fetchGameById } from "../../../lib/data";
import '../page.css';
import { auth } from "@/auth";
import { fetchButtonPicked } from "../../../lib/data";

type GameDetailPageProps = {
    params?: Promise<{
        game_id?: string;
    }>;
};

export default async function Index({ params }: GameDetailPageProps) {
    const resolvedParams = params ? await params : undefined;
    const parsedID = resolvedParams?.game_id ? Number(resolvedParams.game_id) : NaN;

    const session = await auth();
    const player = session?.user?.name; // Replace with actual player name from session

    if (!player) {
        throw new Error("User not authenticated");
    }

    const pick = await fetchButtonPicked(parsedID, player);

    if (!Number.isFinite(parsedID)) {
        notFound();
    }

    const game = await fetchGameById(parsedID);

    if (!game) {
        notFound();
    }

    const isLocked = new Date(`${game.date}T${game.time}Z`) <= new Date();

    return (
        <main className="game-page">
            <Link className="return-link bg-blue-500 text-white p-2 rounded" href="/ui/week">Return</Link>
            <div className="game-info">
                <h1 id="away-team">{game.away_team}</h1>
                <h1 id="at">@</h1>
                <h1 id="home-team">{game.home_team}</h1>
            </div>
            <div className="pick-screen">
                <div className="box left-team">
                    <div className="img-box">
                        <TeamImage team={game.away_team} />
                        <PickGame game_id={game.game_id} isHomeTeam={false} buttonPicked={pick === "away"} isLocked={isLocked} />
                    </div>
                </div>

                <div className="middle-line"></div>
                <div className="box right-team">
                    <div className="img-box">
                        <TeamImage team={game.home_team} />
                        <PickGame game_id={game.game_id} isHomeTeam={true} buttonPicked={pick === "home"} isLocked={isLocked} />
                    </div>
                </div>
            </div>
            {/*
            <figure id="previous-game">
                <img id="left-arrow" src="https://www.svgrepo.com/show/156296/left-arrow-hand-drawn-outline.svg"/>
                <figcaption>Prev. Game</figcaption>
            </figure>
            <div className="score-box">
                <p>Final Score: 37-44</p>
                <p>Incorrect</p>
            </div>
            <figure id="next-game">
                <img id="right-arrow" src="https://www.svgrepo.com/show/156296/left-arrow-hand-drawn-outline.svg"/>
                <figcaption>Next Game</figcaption>
            </figure>
            */}
        </main>
    );
}