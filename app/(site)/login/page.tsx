"use client";

import login from "@/data/site/actions/login";
import { useState, useTransition } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password: string) => password.length >= 8;
  const isValid = isValidEmail(email) && isValidPassword(password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;

    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="container mx-auto px-1 py-4">
      <div className="flex flex-col gap-4">
        <h1>QB Logs Login</h1>
        <form className="lg:w-1/2" onSubmit={handleSubmit}>
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
            <label htmlFor="password" className="mt-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`primary mt-4 w-full ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isValid || isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>
        {!isValid && (
          <div className="text-red-500 text-sm mt-2">
            {email && !isValidEmail(email) && <p>Invalid email format.</p>}
            {password && !isValidPassword(password) && (
              <p>Password must be at least 8 characters.</p>
            )}
          </div>
        )}
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>
    </div>
  );
}