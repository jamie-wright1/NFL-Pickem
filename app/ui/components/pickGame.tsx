'use client';

import { PickGameProps } from "../../lib/definitions";
import { storePick } from "../../lib/actions";
import clsx from "clsx";

export default function PickGame({ game_id, isHomeTeam, buttonPicked, isLocked }: PickGameProps) {
    const className = clsx("pick-button", {
        "bg-gray-300 cursor-not-allowed": isLocked || buttonPicked,
        "bg-yellow-500": !isLocked && !buttonPicked,
    });

    const text = isLocked ? "Closed" : buttonPicked ? "Picked" : "Pick";

    const handlePick = ({ game_id, isHomeTeam }: PickGameProps) => {
        void storePick({ game: game_id, pickedHomeTeam: isHomeTeam });
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (isLocked || buttonPicked) {
            return;
        }
        handlePick({ game_id: game_id, isHomeTeam: isHomeTeam, buttonPicked: buttonPicked, isLocked: isLocked });
    };
    

    return (
        <button type="button" className={className} onClick={handleClick} disabled={isLocked || buttonPicked}>{ text }</button>
    );
}

