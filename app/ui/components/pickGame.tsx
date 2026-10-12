'use client';

import { PickGameProps } from "../../lib/definitions";
import { storePick } from "../../lib/actions";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function PickGame({ game_id, isHomeTeam, buttonPicked, isLocked, odds}: PickGameProps) {
    const router = useRouter();
    const className = clsx("pick-button", {
        "is-closed": isLocked,
        "is-picked": !isLocked && buttonPicked,
    });

    const text = isLocked ? "Closed" : buttonPicked ? "Picked" : "Pick";
    const oddsText = odds !== null && odds > 0 ? `+${odds}` : odds

    const handlePick = async ({ game_id, isHomeTeam }: PickGameProps) => {
        await storePick({ game: game_id, pickedHomeTeam: isHomeTeam });
        router.refresh();
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (isLocked || buttonPicked) {
            return;
        }
        void handlePick({ game_id, isHomeTeam, buttonPicked, isLocked, odds});
    };
    

    return (
        <button type="button" className={className} onClick={handleClick} disabled={isLocked || buttonPicked}>
            {text}
            <br />
            <span className="pick-odds">{oddsText}</span>
        </button>
    );
}
