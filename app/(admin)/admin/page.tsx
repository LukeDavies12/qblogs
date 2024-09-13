import { getUserData } from "@/data/admin-app/get/getUserData";
import Link from "next/link";

export default async function Page() {
  const user_data = await getUserData();

  if (user_data.error) {
    return (
      <div className="container mx-auto px-1 py-4">
        <div className="flex flex-col gap-6">
          <h1>QB Logs Admin</h1>
          <p className="text-red-500">Error: {user_data.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-2 2xl:container">
      <div className="flex flex-col gap-4">
        <h1 >QB Logs Admin</h1>
        <div className="ml-4 flex flex-col gap-2">
          <Link href={"/admin/create-team"} className="link">Create Team</Link>
          <Link href={"/admin/create-user"} className="link">Create User</Link>
        </div>
      </div>
    </div>
  );
}
