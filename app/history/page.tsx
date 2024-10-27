"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import { Query } from "@/models/Query";
import { collection, getDocs, getFirestore } from "@firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function formatRelativeTime(date: number) {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date) / 1000);

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, 'second');
    } else if (diffInSeconds < 3600) {
        return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    } else if (diffInSeconds < 86400) {
        return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    } else {
        return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    }
}

export default function History() {
    const router = useRouter();
    const { user } = useAuth();

    const [queries, setQueries] = useState<Query[]>([]);

    useEffect(() => {
        if (!user?.uid) return;

        const firestore = getFirestore();
        const ref = collection(firestore, "Users", user.uid, "Queries");

        const fetch = async () => {
            const snapshot = await getDocs(ref);
            const queries = snapshot.docs.map((doc) => doc.data() as Query);
            setQueries(queries);
        }

        fetch();
    }, [user?.uid]);

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">

                {queries.map((query, index) => (
                    <Card key={index} className="mt-8 w-full max-w-md cursor-pointer" onClick={() => router.push(`/${query}`)}>
                        <CardTitle>{formatRelativeTime(query.created.toMillis())}</CardTitle>
                        <CardContent>
                            <pre className="whitespace-pre-wrap text-sm">{query.query}</pre>
                        </CardContent>
                    </Card>
                ))}
            </main>
        </div>
    );
}
