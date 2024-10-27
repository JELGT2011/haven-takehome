"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const { user, loading: loadingUser, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [id, setId] = useState("");
  const [metadata, setMetadata] = useState("");

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.value;
    setId(id);

    if (!id) {
      setMetadata("");
      return;
    }

    console.log("Fetching book metadata for ID:", id);

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
  };

  if (!loadingUser && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <button
          onClick={loginWithGoogle}
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        >
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">

        {/* Input for searching Project Gutenberg IDs */}
        <div className="w-full max-w-md">
          <label htmlFor="gutenbergId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search Project Gutenberg ID
          </label>
          <Input
            id="gutenbergId"
            type="text"
            onChange={handleInputChange}
            value={id}
            placeholder="Enter Gutenberg ID"
            className="mt-2"
          />
        </div>

        {/* Display Book Metadata */}
        <Card className="mt-8 w-full max-w-md cursor-pointer">
          <CardTitle>Metadata</CardTitle>
          <CardContent className="overflow-y-auto max-h-96">
            <pre className="whitespace-pre-wrap text-sm">{metadata}</pre>
          </CardContent>
        </Card>

        {/* Display Read Book Button */}
        <Button
          onClick={() => {
            if (!id) return;

            router.push(`/${id}`);
          }}
          disabled={!id}
          className="mt-8"
        >
          Read Book
        </Button>

      </main>
    </div>
  );
}