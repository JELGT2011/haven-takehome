// import { GutenbergResponse } from "@/models/GutenbergResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing book ID" }, { status: 400 });
  }

  const metadataUrl = `https://www.gutenberg.org/ebooks/${id}`;

  try {
    const metadataResponse = await fetch(metadataUrl);

    if (!metadataResponse.ok) {
      return NextResponse.json({ error: "Book metadata not found." }, { status: 404 });
    }

    const metadata = await metadataResponse.text();

    // Assuming we parse metadata from HTML (placeholders used here)
    // const metadata: BookMetadata = {
    //   id,
    //   title: "Parsed Title Placeholder", // Replace with parsed title
    //   author: "Parsed Author Placeholder", // Replace with parsed author
    // };

    return NextResponse.json({ metadata });
  } catch (error) {
    console.error("Error fetching book metadata:", error);
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 });
  }
}

export async function GETContent(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing book ID" }, { status: 400 });
  }

  const contentUrl = `https://www.gutenberg.org/files/${id}/${id}-0.txt`;

  try {
    const contentResponse = await fetch(contentUrl);

    if (!contentResponse.ok) {
      return NextResponse.json({ error: "Book content not found." }, { status: 404 });
    }

    const content = await contentResponse.text();

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error fetching book content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const id = searchParams.get("id");

//   if (!id) {
//     return NextResponse.json({ error: "Missing book ID" }, { status: 400 });
//   }

//   try {
//     const [metadataResponse, contentResponse] = await Promise.all([
//       GETMetadata(request),
//       GETContent(request),
//     ]);

//     if (metadataResponse.status !== 200 || contentResponse.status !== 200) {
//       return NextResponse.json({ error: "Book not found." }, { status: 404 });
//     }

//     const metadata = await metadataResponse.json();
//     const content = await contentResponse.json();

//     const response: GutenbergResponse = {
//       metadata: metadata.metadata,
//       content: content.content,
//     };

//     return NextResponse.json(response);
//   } catch (error) {
//     console.error("Error fetching book data:", error);
//     return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
//   }
// }