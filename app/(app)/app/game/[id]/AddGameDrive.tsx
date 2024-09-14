"use client"

import { createGameDrive } from "@/data/app/actions/GameDrives";
import { useState, useTransition } from "react";

interface CreateGameDriveProps {
  gameId: number;
}

export default function AddGameDrive({ gameId }: CreateGameDriveProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleCreateDrive = async () => {
    startTransition(async () => {
      try {
        await createGameDrive(gameId);
      } catch (error) {
        setError(String(error));
      }
    });
  };

  return (
    <form onSubmit={handleCreateDrive}>
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" disabled={isPending} className="primary">
        {isPending ? "Adding... New Game Drive" : "Add New Game Drive"}
      </button>
    </form>
  )
}