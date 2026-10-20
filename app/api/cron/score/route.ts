import { NextRequest, NextResponse } from "next/server";
import runScoring from "@/app/lib/scoring";
import { updateTeamRecordsFromAPI } from "@/app/lib/actions";
import { populateOdds } from "@/app/lib/script";

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runScoring();
  await updateTeamRecordsFromAPI();
  const oddsResult = await populateOdds();

  return NextResponse.json({ ...result, odds: oddsResult });
}
