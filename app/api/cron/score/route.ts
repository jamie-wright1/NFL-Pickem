import { NextRequest, NextResponse } from "next/server";
import runScoring from "@/app/lib/scoring";


export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runScoring();

  return NextResponse.json(result);

}