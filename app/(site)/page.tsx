import { getUserData } from "@/data/admin-app/get/getUserData";
import Link from "next/link";

export default async function Page() {
  const user_role = await getUserData();

  return (
    <div className="flex flex-col gap-1">
      <h1>QB Logs (BCU Pre-Alpha)</h1>
      {user_role.isUser ? (
        <p className="text-yellow-700">
          You are already logged in! <Link href="/app" className="link">Dashboard</Link>
        </p>
      ) : (
        <Link href="/login" className="px-6 py-1 font-medium rounded-2xl bg-transparent hover:bg-primary hover:text-primary-foreground border-2 border-primary w-44">
          Login
        </Link>
      )}
    </div>
  );
}