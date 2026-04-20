import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Pool from "@/models/Pool";

export async function GET() {
  try {
    await connectDB();
    const stats = await Pool.findOne({ poolId: "XLM-TKNA" });
    return NextResponse.json(stats || { 
      poolId: "XLM-TKNA",
      xlmReserve: "1000000",
      tknaReserve: "50000",
      totalShares: "100000",
      volume24h: 482000,
      tvlUSD: 2450000
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pool stats" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const stats = await Pool.findOneAndUpdate(
      { poolId: "XLM-TKNA" },
      { $set: body, lastUpdated: new Date() },
      { upsert: true, new: true }
    );
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 });
  }
}
