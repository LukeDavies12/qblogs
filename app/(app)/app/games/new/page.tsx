"use client"

import BackLink from "@/comp/ui/backlink";
import { addGame } from "@/data/app/actions/Games";
import { useEffect, useState, useTransition } from "react";

export default function AddGamePage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    against: "",
    result: ""
  });

  useEffect(() => {
    const { date, against, result } = formData;
    setIsFormValid(date !== "" && against !== "" && result !== "");
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSubmit = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await addGame(formDataToSubmit);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An error occurred');
      }
    });
  };

  return (
    <>
      <BackLink href="/app/games" label="All Games" />
      <h1>New Game</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-2 lg:mx-auto lg:w-1/2 p-4 bg-neutral-50 rounded-2xl mt-4">
        <div>
          <label htmlFor="date">Date</label>
          <input 
            type="date" 
            id="date" 
            name="date" 
            required 
            value={formData.date}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="against">Against</label>
          <input 
            type="text" 
            id="against" 
            name="against" 
            placeholder="New England" 
            required 
            value={formData.against}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="result">Result</label>
          <select 
            id="result" 
            name="result" 
            required 
            value={formData.result}
            onChange={handleInputChange}
          >
            <option value="">Select a result</option>
            <option value="true">Win</option>
            <option value="false">Loss</option>
          </select>
        </div>
        <button 
          type="submit" 
          disabled={isPending || !isFormValid} 
          className={`primary w-full ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isPending ? 'Adding Game...' : 'Add Game'}
        </button>
      </form>
    </>
  );
}