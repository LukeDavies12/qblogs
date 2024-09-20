import Link from "next/link";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="py-2 px-4 container mx-auto">
      <nav className="mb-2 flex gap-4">
      <Link href={"/"} className="link">Home</Link>
        <Link href={"/about"} className="link">About</Link>
      </nav>
      <div>
      {children}
      </div>
    </div>
  );
}
