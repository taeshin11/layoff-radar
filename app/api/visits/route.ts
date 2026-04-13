import { NextResponse } from "next/server";

// Simple in-memory visitor counter (resets on cold start)
// In production, replace with Upstash Redis
let totalVisits = Math.floor(Math.random() * 5000) + 1000;
let todayVisits = Math.floor(Math.random() * 200) + 50;
let lastDate = new Date().toDateString();

export async function GET() {
  const today = new Date().toDateString();
  if (today !== lastDate) {
    todayVisits = 0;
    lastDate = today;
  }
  totalVisits++;
  todayVisits++;
  return NextResponse.json({ today: todayVisits, total: totalVisits });
}
