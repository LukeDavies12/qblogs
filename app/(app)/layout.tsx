import Logo from "@/comp/brand/logo";
import { getUserData } from "@/data/admin-app/get/getUserData";
import Link from "next/link";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user_role = await getUserData();

  if (user_role.isUser === false) {
    return (
      <div className="py-2 px-4 2xl:container mx-auto">
        <div className="flex flex-col gap-6">
          <h1>QB Logs Dashboard</h1>
          <p className="text-red-500">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div className="py-2 px-4 2xl:container mx-auto">
          <nav className="flex justify-between items-center">
            <div>
              <Link href={"/app"}><Logo /></Link>
            </div>
            <div>
              <Link href={"/app/games"} className="link">Games</Link>
            </div>
          </nav>
          <div className="flex flex-col gap-2 mt-2">{children}</div>
        </div>
      </>
    );
  }
}