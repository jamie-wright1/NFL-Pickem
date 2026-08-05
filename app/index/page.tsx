import Link from "next/link";
import PickGame from "./client";
import TeamImage from "../components/teamImage";
import './page.css'; // Import CSS file



export default function Index() {
  return (  
    <main>
        <Link href="/games">Games</Link>
        <div className="game-info">
            <h1 id="homse-team">Seattle Seahawks (10-1-0)</h1>
            <h1 id="at">@</h1>
            <h1 id="away-team">Jacksonville Jaguars(5-6-1)</h1>
        </div>
        <div className = "pick-screen">
            <div className="box left-team">
               
                <div className="img-box">
                    <TeamImage team="Seattle Seahawks" />
                    <div className="pick-box">
                        <PickGame team='Seahawks' />
                    </div>
                </div>
            </div>

            <div className="middle-line"></div>
            <div className="box right-team">
                <div className="img-box">
                    <TeamImage team="Jacksonville Jaguars" />
                    <div className="pick-box">
                        <PickGame team='Jaguars' />
                    </div>
                </div>    
            </div>
        </div>
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
    </main>
  );
}