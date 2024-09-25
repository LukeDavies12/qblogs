"use client";

import { updatePlay } from "@/data/app/actions/Plays";
import { getPlayById } from "@/data/app/get/play";
import { Play } from "@/data/types/logPlayTypes";
import { useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: { id: string };
}) {
  const [playData, setPlayData] = useState<Play | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchPlayData();
    }
  }, [params.id]);

  const fetchPlayData = async () => {
    try {
      const data = await getPlayById(Number(params.id));
      setPlayData(data);
    } catch (err) {
      setError("Failed to fetch play data.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (playData) {
      setPlayData({ ...playData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (playData) {
        const formDataToSend = new FormData();
        Object.entries(playData).forEach(([key, value]) => {
          if (value !== undefined) {
            formDataToSend.append(key, value); // Directly append without type assertion
          }
        });
        await updatePlay(formDataToSend, Number(params.id));
      } else {
        setError("Play data is null.");
      }
    } catch (err) {
      setError("Failed to update play data.");
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!playData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Play Details</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="play_call" className="block">Play Call</label>
          <input
            type="text"
            id="play_call"
            name="play_call"
            value={playData.play_call}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="result" className="block">Result</label>
          <select
            id="result"
            name="result"
            value={playData.result}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="border rounded p-2 w-full"
          >
            <option value="Complete">Complete</option>
            <option value="Incomplete">Incomplete</option>
            <option value="Run">Run</option>
            {/* Add other options as needed */}
          </select>
        </div>
        {/* Add more fields as necessary */}
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="primary"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
        {isEditing && (
          <button type="submit" className="primary">
            Update Play
          </button>
        )}
      </form>
    </div>
  );
}