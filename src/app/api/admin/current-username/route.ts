import { NextResponse } from "next/server";
import { getCurrentUsername } from "@/lib/auth";
import { checkAuth } from "@/lib/auth";

export async function GET() {
  const isAuthenticated = await checkAuth();
  
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const username = await getCurrentUsername();
    return NextResponse.json({ username });
  } catch (error) {
    console.error("Error getting username:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

