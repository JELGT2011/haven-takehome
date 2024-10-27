import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing book ID" }, { status: 400 });
  }

  const url = `https://www.gutenberg.org/files/${id}/${id}-0.txt`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: "Book content not found." }, { status: 404 });
    }

    const content = await response.text();

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error fetching book content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}
