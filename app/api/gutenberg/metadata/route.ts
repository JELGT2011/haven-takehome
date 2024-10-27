import { db } from "@/lib/admin";
import { NextRequest, NextResponse } from "next/server";
// import { OpenAI } from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// });

// const prompt = `
// The following is the metadata for a book from Project Gutenberg.
// Parse the HTML content into structured JSON data.
// Include only metadata about the book, and not extraneous information about Project Gutenberg.

// Example:
// {
//   "title": "Pride and Prejudice",
//   "author": {
//     "name": "Jane Austen",
//     "birth": "1775",
//     "death": "1817",
//   },
//   "language": "English",
//   "subjects": [
//     "Fiction",
//     "Romance",
//   ],
//   "summary": "Pride and Prejudice is a novel by Jane Austen...",
// }
// `;

// const ParseMetadata = async (raw: string) => {
//   const parsed = await openai.chat.completions.create({
//     model: "gpt-4o",
//     messages: [
//       { role: "system", content: prompt },
//       { role: "user", content: raw },
//     ],
//     response_format: { type: "json_object" },
//     stream: false,
//   });

//   const content = parsed.choices[0].message.content;
//   if (content === null) {
//     throw new Error("Parsed metadata is null");
//   }

//   return JSON.parse(content);
// }

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing book ID" }, { status: 400 });
  }

  const doc = await db.collection("Metadata").doc(id).get();
  if (doc.exists) {
    return NextResponse.json({ raw: doc.data() });
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
