import { getUserData } from "@/data/admin-app/get/getUserData";
import Link from "next/link";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user_role = await getUserData();

  if (user_role.isUser === true) {
    return (
      <div className="mx-auto px-4 py-2 2xl:container">
        <div className="flex flex-col gap-6">
          <p className="text-yellow-700">You are already loggin in! <Link href={"/app"} className="link">Dashboard</Link></p>
        </div>
      </div>
    );
  } else {
    return (
      <>
        {children}
      </>
    );
  }
}
