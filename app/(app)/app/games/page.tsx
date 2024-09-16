import seasonGames from "@/data/app/get/seasonGames";
import { formatDate } from "@/data/types/parseDate";
import Link from "next/link";

export default async function Page() {
  const result = await seasonGames();

  if (result.error) {
    return <div>Error: {result.error}</div>;
  }

  const games = result.season_games || [];

  return (
    <div className="space-y-1">
      <h1>Games</h1>
      <ul className="space-y-2 pb-3">
        {games.map((game) => (
          <li key={game.id}>
            <Link
              href={`/app/game/${game.id}`}
              className="block p-2 bg-card hover:bg-neutral-50 hover:text-neutral-600 text-neutral-700 rounded-xl underline"
            >
              <p className="text-sm text-muted-foreground">
                {formatDate(game.date)} vs {game.against}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <Link href={"/app/games/new"} className="link">Add New Game</Link>
    </div>
  )
}