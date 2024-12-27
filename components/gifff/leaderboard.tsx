import { Card, CardContent } from "@/components/ui/card";
import { Coins, Crown, Trophy } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<
    { name: string; points: 8000; rank: number }[]
  >([]);

  const fetchLeaderboardData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API}referral/top-users`
      );
      setLeaderboardData([
        ...data.data.map(
          (
            player: { user: { name: string }; points: number },
            index: number
          ) => ({
            name: player.user.name,
            points: player.points,
            rank: index + 1,
          })
        ),
      ]);
    } catch (error) {
      console.error("Error while fetching leaderboard data:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  return (
    <section className="grid place-items-center p-4" id="leaderboard">
      <h1 className="text-xl font-bold mb-4">
        <Trophy size={20} className="mr-2 inline" />
        Leaderboard
      </h1>
      <div className="grid grid-cols-3 place-items-center">
        <div className="w-full p-4 bg-white border-none grid place-items-center gap-2">
          <div
            className={cn(
              "size-16 uppercase relative grid place-items-center text-center font-bold rounded-full text-3xl bg-gray-500 text-white"
            )}
          >
            {leaderboardData?.[1]?.name[0]}
            <Badge className="p-0 size-5 bg-fuchsia-950 grid place-items-center absolute -bottom-2">
              {leaderboardData?.[1]?.rank}
            </Badge>
          </div>
          <span className="capitalize text-center text-xs mx-auto line-clamp-1">
            {leaderboardData?.[1]?.name || "Someone"}
          </span>
          <Badge className="rounded p-1 px-3 bg-fuchsia-950/10 text-fuchsia-950 font-bold hover:bg-fuchsia-950/10">
            <Coins size={14} className="mr-2 fill-yellow-600 text-yellow-400" />
            {leaderboardData?.[1]?.points}
          </Badge>
        </div>
        <div className="w-full p-4 bg-white border-none grid place-items-center gap-2">
          <div
            className={cn(
              "size-16 uppercase relative grid place-items-center text-center font-bold rounded-full text-3xl bg-yellow-600 text-white scale-125 bottom-4"
            )}
          >
            {leaderboardData?.[0]?.name[0]}
            <Badge className="p-0 size-5 bg-fuchsia-950 grid place-items-center absolute -bottom-2">
              {leaderboardData?.[0]?.rank}
            </Badge>
          </div>
          <span className="capitalize text-center text-xs mx-auto line-clamp-1">
            {leaderboardData?.[0]?.name || "Someone"}
          </span>
          <Badge className="rounded p-1 px-3 bg-fuchsia-950/10 text-fuchsia-950 font-bold hover:bg-fuchsia-950/10">
            <Coins size={14} className="mr-2 fill-yellow-600 text-yellow-400" />
            {leaderboardData?.[0]?.points}
          </Badge>
        </div>
        <div className="w-full p-4 bg-white border-none grid place-items-center gap-2">
          <div
            className={cn(
              "size-16 uppercase relative grid place-items-center text-center font-bold rounded-full text-3xl bg-yellow-800 text-white"
            )}
          >
            {leaderboardData?.[2]?.name[0]}
            <Badge className="p-0 size-5 bg-fuchsia-950 grid place-items-center absolute -bottom-2">
              {leaderboardData?.[2]?.rank}
            </Badge>
          </div>
          <span className="capitalize text-center text-xs mx-auto line-clamp-1">
            {leaderboardData?.[2]?.name || "Someone"}
          </span>
          <Badge className="rounded p-1 px-3 bg-fuchsia-950/10 text-fuchsia-950 font-bold hover:bg-fuchsia-950/10">
            <Coins size={14} className="mr-2 fill-yellow-600 text-yellow-400" />
            {leaderboardData?.[2]?.points}
          </Badge>
        </div>
      </div>
      <Card className="grid gap-4 w-full border-0 shadow rounded-2xl">
        <CardContent className="pt-4 px-3">
          <ul className="space-y-3">
            {leaderboardData.slice(3).map((player, index) => (
              <li
                className="flex items-center justify-between"
                key={player.name}
              >
                <span className="space-x-3 flex items-center">
                  <div className="size-6 text-center font-bold rounded-full inline-block bg-yellow-100">
                    {player.rank}
                  </div>
                  <span className="text-sm">{player.name || "Someone"}</span>
                </span>
                <Badge className="rounded p-1 px-3 bg-fuchsia-950/10 text-fuchsia-950 font-bold hover:bg-fuchsia-950/10">
                  <Coins
                    size={14}
                    className="mr-2 fill-yellow-600 text-yellow-400"
                  />
                  {player.points}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
