import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.trim().length < 3) {
      return NextResponse.json({ results: [] });
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      q
    )}&limit=5&addressdetails=1&accept-language=ru`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "heavy-profile-site/1.0 (contacts-map-autocomplete)",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ results: [] }, { status: 200 });
    }

    const data = (await res.json()) as Array<{
      display_name: string;
      lat: string;
      lon: string;
    }>;

    const results = data.map((item) => ({
      displayName: item.display_name,
      lat: item.lat,
      lon: item.lon,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Maps search error", error);
    return NextResponse.json({ results: [] }, { status: 200 });
  }
}


