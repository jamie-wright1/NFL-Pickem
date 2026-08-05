import React from "react";
import Image from "next/image";

type TeamImageProps = {
    team: string;
};

export default function TeamImage({ team }: TeamImageProps) {
    const teamImages: { [key: string]: string } = {
        'Seattle Seahawks': '/Icons/Seahawks.png',
        'Jacksonville Jaguars': '/Icons/Jaguars.png',
        // Add more teams and their corresponding image paths here
    }

    return <Image className="team-image" src={teamImages[team] || '/Icons/default.png'} alt={team} />;
}