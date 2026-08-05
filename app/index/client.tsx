'use client';

type PickGameProps = {
    team: string;
};

export default function PickGame({ team }: PickGameProps) {
    const handlePick = (team: string) => {
        alert(`You picked ${team}`);
    }
    return (
        <button className="pick-button" onClick={() => handlePick(team)}>Pick</button>
    );
}

