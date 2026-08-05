import Link from "next/link";
import React from 'react';
import GameRows from "../components/gameRows";
import './page.css'; // Import CSS file

export default function Games() {
    return (
    <main>
        <Link href = "/">Back to Home </Link>
        <Link href = "/index">To Index</Link>
        <h1 id = "Header">| Games for the week of Oct. 23-31 |</h1>
        <div className = "week-box">
          <h2 id="week-stats-header">Week 13 Stats</h2>
          <h3 id="week-percentage">5/13</h3>
          <h3 id="opponent-percentage">7/13</h3>
        </div>
        <GameRows week = {1} />
      </main>
   );
}