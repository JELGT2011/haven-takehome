"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800 p-4 shadow-md">
      <Tabs defaultValue="home">
        <TabsList className="flex justify-center space-x-4">
          <Link href="/" passHref>
            <TabsTrigger
              value="home"
              className={pathname === "/" ? "text-blue-500 font-semibold" : ""}
            >
              Home
            </TabsTrigger>
          </Link>

          <Link href="/history" passHref>
            <TabsTrigger
              value="history"
              className={pathname === "/history" ? "text-blue-500 font-semibold" : ""}
            >
              History
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
    </div>
  );
}
