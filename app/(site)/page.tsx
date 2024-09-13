import Link from "next/link";

export default function Page() {
  return (
    <div className="container mx-auto px-1 py-4">
      <div className="flex flex-col gap-6">
        <h1 className="font-bold text-xl">QB Logs (BCU Pre-Alpha)</h1>
        <Link href={"/login"} className="px-6 py-1 font-medium rounded-2xl bg-transparent hover:bg-primary hover:text-primary-foreground border-2 border-primary w-44">Login</Link>
      </div>
    </div>
  )
}