import { db } from "@/lib/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing book ID" }, { status: 400 });
  }

  const doc = await db.collection("Metadata").doc(id).get();
  if (doc.exists) {
    return NextResponse.json(doc.data());
  }

  const url = `https://www.gutenberg.org/ebooks/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: "Book metadata not found." }, { status: 404 });
    }

    const metadata = await response.text();
    db.collection("Metadata").doc(id).set({ raw: metadata });

    return NextResponse.json({ raw: metadata });
  } catch (error) {
    console.error("Error fetching book metadata:", error);
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 });
  }
}
