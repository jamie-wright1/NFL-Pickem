import React from "react";
import Image from "next/image";
import { TeamImageProps } from "../../lib/definitions";

export default function TeamImage({ team }: TeamImageProps) {
    const teamImages: { [key: string]: string } = {
        'Seattle Seahawks': '/Icons/Teams/Seahawks.png',
        'Jacksonville Jaguars': '/Icons/Teams/Jaguars.png',
        'New England Patriots': '/Icons/Teams/Patriots.png',
        'New York Jets': '/Icons/Teams/Jets.png',
        'Miami Dolphins': '/Icons/Teams/Dolphins.png',
        'Buffalo Bills': '/Icons/Teams/Bills.png',
        'Baltimore Ravens': '/Icons/Teams/Ravens.png',
        'Cincinnati Bengals': '/Icons/Teams/Bengals.png',
        'Pittsburgh Steelers': '/Icons/Teams/Steelers.png',
        'Cleveland Browns': '/Icons/Teams/Browns.png',
        'Kansas City Chiefs': '/Icons/Teams/Chiefs.png',
        'Los Angeles Chargers': '/Icons/Teams/Chargers.png',
        'Denver Broncos': '/Icons/Teams/Broncos.png',
        'Green Bay Packers': '/Icons/Teams/Packers.png',
        'Chicago Bears': '/Icons/Teams/Bears.png',
        'Minnesota Vikings': '/Icons/Teams/Vikings.png',
        'Tampa Bay Buccaneers': '/Icons/Teams/Buccaneers.png',
        'New Orleans Saints': '/Icons/Teams/Saints.png',
        'Atlanta Falcons': '/Icons/Teams/Falcons.png',
        'Carolina Panthers': '/Icons/Teams/Panthers.png',
        'Tennessee Titans': '/Icons/Teams/Titans.png',
        'Indianapolis Colts': '/Icons/Teams/Colts.png',
        'Dallas Cowboys': '/Icons/Teams/Cowboys.png',
        'Philadelphia Eagles': '/Icons/Teams/Eagles.png',
        'Washington Commanders': '/Icons/Teams/Commanders.png',
        'Arizona Cardinals': '/Icons/Teams/Cardinals.png',
        'Los Angeles Rams': '/Icons/Teams/Rams.png',
        'San Francisco 49ers': '/Icons/Teams/49ers.png',
        'Las Vegas Raiders': '/Icons/Teams/Raiders.png',
        'Houston Texans': '/Icons/Teams/Texans.png',
        'Detroit Lions': '/Icons/Teams/Lions.png',
        'New York Giants': '/Icons/Teams/Giants.png',
        // Add more teams and their corresponding image paths here
    }

    const imagePath = teamImages[team.trim()]
        ?? Object.entries(teamImages).find(([name]) => name.toLowerCase() === team.trim().toLowerCase())?.[1];

    return (
        <Image
            className="team-image"
            src={imagePath || '/Icons/Teams/Seahawks.png'}
            alt={`${team} logo`}
            width={56}
            height={56}
        />
    );
}