import { NextResponse } from "next/server";
import { getHomeAdmin } from "@/app/actions/homeAdmin";

export async function GET() {
  const data = await getHomeAdmin();
  return NextResponse.json(data);
}


