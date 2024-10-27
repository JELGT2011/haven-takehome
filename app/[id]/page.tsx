"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const BookPage = () => {
    const { id } = useParams();

    const [metadata, setMetadata] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchMetadata = async () => {
            try {
                const response = await fetch(`/api/gutenberg/metadata?id=${id}`);
                if (response.ok) {
                    const metadata = await response.json();
                    setMetadata(metadata.raw);
                } else {
                    setMetadata("Book metadata not found.");
                }
            } catch (error) {
                console.error("Error fetching book metadata:", error);
                setMetadata("Failed to load book metadata.");
            }
        }

        const fetchContent = async () => {
            try {
                const response = await fetch(`/api/gutenberg/content?id=${id}`);
                if (response.ok) {
                    const content = await response.text();
                    setContent(content);
                } else {
                    setContent("Book content not found.");
                }
            } catch (error) {
                console.error("Error fetching book content:", error);
                setContent("Failed to load book content.");
            }
        }

        fetchMetadata();
        fetchContent();
    }, [id]);

    if (!id) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">

                {/* Display Book Metadata */}
                <Card className="mt-8 w-full max-w-md cursor-pointer">
                    <CardTitle>Metadata</CardTitle>
                    <CardContent className="overflow-y-auto max-h-96">
                        <pre className="whitespace-pre-wrap text-sm">{metadata}</pre>
                    </CardContent>
                </Card>

                {/* Display Book Contents */}
                <Card className="mt-8 w-full max-w-md cursor-pointer">
                    <CardTitle>Content</CardTitle>
                    <CardContent className="overflow-y-auto max-h-96">
                        <pre className="whitespace-pre-wrap text-sm">{content}</pre>
                    </CardContent>
                </Card>

                {/* Display Analysis Button */}
                <Button
                    // onClick={handleCardClick}
                    disabled={!id}
                    className="mt-8"
                >
                    Run Analysis
                </Button>

            </main>
        </div>
    );
};

export default BookPage;
