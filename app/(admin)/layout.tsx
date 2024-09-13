import { getUserData } from "@/data/admin-app/get/getUserData";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user_role = await getUserData();

  if (user_role.roleCode !== "sa") {
    return (
      <div className="container mx-auto px-1 py-4">
        <div className="flex flex-col gap-6">
          <h1 className="font-bold text-xl">QB Logs Admin</h1>
          <p className="text-red-500">You do not have permission to access this page.</p>
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
