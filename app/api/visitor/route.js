import { NextResponse } from "next/server";

const COUNTER_URL =
  "https://api.counterapi.dev/v1/sreedev-portfolio/home-visitors/up";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(COUNTER_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("Counter service unavailable");

    const data = await response.json();
    return NextResponse.json(
      { count: Math.max(1, Number(data.count) || 1) },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch {
    return NextResponse.json(
      { count: 1, fallback: true },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }
}
