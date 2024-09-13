"use client"

import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState('');

  return (
    <div className="container mx-auto px-1 py-4">
      <div className="flex flex-col gap-6">
        <h1 className="font-bold text-xl">QB Logs Login</h1>
        <form className="border-2 rounded-3xl border-slate-100 p-4 md:w-1/2 md:mx-auto">
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="mt-6 w-full"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}