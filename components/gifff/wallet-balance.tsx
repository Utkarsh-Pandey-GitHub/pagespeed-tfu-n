import { Coins } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import mixpanel from "@/utils/mixpanel";

export default function WalletBalance({
  balance,
}: {
  balance: number | undefined;
}) {
  const router = useRouter();

  return (
    <Button
      size={"sm"}
      variant={"secondary"}
      onClick={() => {
        const userData = JSON.parse(localStorage.getItem("tw-user") ?? "{}");
        mixpanel.track("wallet", {
          balance: balance ?? 0,
          name: userData.name,
          phone: userData,
        });
        router.push("/gifff/dashboard?page=redeem");
      }}
      className="border-none hover:bg-secondary bg-opacity-10 gap-1 text-white"
    >
      <strong className="text-lg">{balance ?? 0}</strong>
      <Coins className="w-4 text-yellow-400 h-4" />
    </Button>
  );
}
