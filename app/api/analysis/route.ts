import { db } from "@/lib/admin";
import { GenerateAnalysis } from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
        return NextResponse.json({ error: "Missing book ID" }, { status: 400 });
    }

    const doc = await db.collection("Analysis").doc(id).get();
    if (doc.exists) {
        return NextResponse.json(doc.data());
    }

    const book = await db.collection("Books").doc(id).get();
    let content: string;

    if (book.exists) {
        const data = book.data();
        if (data) {
            content = data.raw;
        } else {
            return NextResponse.json({ error: "Book data not found." }, { status: 404 });
        }
    } else {
        const url = `https://www.gutenberg.org/files/${id}/${id}.txt`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                return NextResponse.json({ error: "Book content not found." }, { status: 404 });
            }

            content = await response.text();
            db.collection("Books").doc(id).set({ raw: content });
        } catch (error) {
            console.error("Error fetching book content:", error);
            return NextResponse.json({ error: "Failed to fetch book content" }, { status: 500 });
        }
    }

    try {
        const analysis = await GenerateAnalysis(content);
        db.collection("Analysis").doc(id).set({ analysis });

        return NextResponse.json(analysis);
    } catch (error) {
        console.error("Error generating analysis:", error);
        return NextResponse.json({ error: "Failed to generate analysis" }, { status: 500 });
    }
}
