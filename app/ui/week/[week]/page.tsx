import Link from "next/link";
import Leaderboard from "../../components/leaderboard";
import GameRows from "../../components/gameRows";
import "../page.css";
import { signOut } from "../../../../auth";

type WeekPageProps = {
  params?: Promise<{
    week?: string;
  }>;
};

export default async function WeekPage({ params }: WeekPageProps) {
  const resolvedParams = params ? await params : undefined;
  const requestedWeek = Number(resolvedParams?.week);
  const week = Number.isInteger(requestedWeek) && requestedWeek >= 1 && requestedWeek <= 18
    ? requestedWeek
    : 1;

  return (
    <main className="week-page">
        <div className="top-bar">
            <form
            action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
            }}
            >
            <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                <div className="hidden md:block bg-blue-500 text-white p-2 rounded">Sign Out</div>
            </button>
        </form>
      </div>
      <Leaderboard />
      <GameRows week={week} />
    </main>
  );
}
