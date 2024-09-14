"use client"

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Page() {
  <>
    <Link href={"/app/games"}>
      <ArrowLeftIcon className="h-6 w-6" />
      All Games
    </Link>
    <h1>New Game</h1>

  </>
}