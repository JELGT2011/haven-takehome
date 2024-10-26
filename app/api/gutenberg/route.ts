import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Missing book ID" }, { status: 400 });
    }

    const metadataUrl = `https://www.gutenberg.org/ebooks/${id}`;
    const contentUrl = `https://www.gutenberg.org/files/${id}/${id}-0.txt`;

    try {
        const [metadataResponse, contentResponse] = await Promise.all([
            fetch(metadataUrl),
            fetch(contentUrl),
        ]);

        if (!metadataResponse.ok || !contentResponse.ok) {
            return NextResponse.json({ error: "Book not found." }, { status: 404 });
        }

        const metadataHtml = await metadataResponse.text();
        const contentText = await contentResponse.text();

        return NextResponse.json({ metadataHtml, contentText });
    } catch (error) {
        console.error("Error fetching book data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
