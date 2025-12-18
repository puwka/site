import { NextResponse } from "next/server";
import { getServiceOverrides } from "@/app/actions/adminServices";

export async function GET() {
  const overrides = await getServiceOverrides();
  return NextResponse.json(overrides);
}


