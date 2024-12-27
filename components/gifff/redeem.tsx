import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Loader, Lock } from "lucide-react";
import Leaderboard from "./leaderboard";
import useKey from "@/hooks/use-key";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import mixpanel from "@/utils/mixpanel";
import Image from "next/image";
import Link from "next/link";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { DashboardData } from "@/pages/gifff/dashboard";
import ExpandableText from "../ui/expandable-text";

export default function Redeem({
  dashboardData,
}: {
  dashboardData: DashboardData | null;
}) {
  return (
    <section className="grid gap-4 p-2">
      {/* Banner */}
      <Link
        href="#leaderboard"
        onClick={() => {
          const userData = JSON.parse(
            localStorage.getItem("tfu-user-auth") ?? "{}"
          );
          mixpanel.track("view_leaderboard", {
            name: userData.name,
            phone: userData.phone,
          });
        }}
      >
        <Image
          src="/gifff/redeem-banner.png"
          alt="Redeem Banner"
          width={500}
          height={200}
          className="aspect-video px-3"
        />
      </Link>

      <Rewards
        points={dashboardData?.points}
        referralUrl={dashboardData?.referralId}
      />
      <Leaderboard />
    </section>
  );
}

const Rewards = React.memo(
  ({
    points,
    referralUrl,
  }: {
    points: number | undefined;
    referralUrl: string | undefined;
  }) => {
    const [activeReward, setActiveReward] = React.useState<string | null>(null);
    const [notEnoughCoins, setNotEnoughCoins] = React.useState<string | null>(
      null
    );
    const rewards = useKey<{
      [key: string]: {
        points: number;
        description: string;
        label?: string;
      };
    }>("redeemEntities", {
      json: true,
    });

    return (
      <section className="grid place-items-center gap-4 p-2">
        <h2 className="text-2xl">Rewards</h2>
        {rewards ? (
          Object.entries(rewards)?.map((reward, index) => (
            <Card
              onClick={() => {
                mixpanel.track("redeem_clicked", {
                  coins: points,
                  gift: reward[0],
                  name: localStorage.getItem("tfu-user-auth")
                    ? JSON.parse(localStorage.getItem("tfu-user-auth") ?? "{}")
                        .name
                    : null,
                  phone: localStorage.getItem("tfu-user-auth")
                    ? JSON.parse(localStorage.getItem("tfu-user-auth") ?? "{}")
                        .phone
                    : null,
                });
                if (points && points >= reward[1].points) {
                  setActiveReward(reward[0]);
                } else {
                  setNotEnoughCoins(reward[0]);
                }
              }}
              key={index}
              className="flex p-2 px-3 gap-2 w-full items-center rounded-xl border-0 shadow cursor-pointer"
            >
              <CardHeader className="grid gap-0 p-0 space-y-0 flex-1">
                <CardTitle className="text-lg capitalize font-semibold">
                  {reward[0]}
                </CardTitle>
                <CardContent className="p-0">
                  <ExpandableText>{reward[1].description}</ExpandableText>
                </CardContent>
              </CardHeader>
              <Badge className="rounded-lg bg-fuchsia-950 h-8 hover:bg-fuchsia-950">
                <Coins
                  size={16}
                  className="mr-2 fill-yellow-600 text-yellow-400"
                />
                {reward[1].points}
              </Badge>
            </Card>
          ))
        ) : (
          <>
            <Skeleton className="w-full h-20" />
            <Skeleton className="w-full h-20" />
          </>
        )}

        {activeReward && rewards && rewards[activeReward] && (
          <RedeemPopup
            reward={activeReward}
            description={rewards[activeReward]}
            activeReward={activeReward}
            setActiveReward={setActiveReward}
          />
        )}
        {notEnoughCoins && (
          <Dialog open={true} onOpenChange={(open) => setNotEnoughCoins(null)}>
            <DialogContent
              withClose={false}
              className="max-w-xs !rounded-2xl overflow-hidden gap-1 p-0 border-none"
            >
              <DialogTitle className="p-4 pb-1 text-2xl text-center">
                {notEnoughCoins}
              </DialogTitle>
              <Button
                asChild
                className="flex gap-2 mx-auto rounded-lg bg-green-600 font-normal items-center px-4"
                size={"lg"}
              >
                <a
                  onClick={() => {
                    const userDataAsJSON = JSON.parse(
                      localStorage.getItem("tfu-user-auth") ?? "{}"
                    );
                    mixpanel.track("referral_shared", {
                      source: localStorage.getItem("tw-referrer")
                        ? "referral"
                        : "direct",
                      cta: "Whatsapp",
                      position: "not enough coins popup",
                      ...(userDataAsJSON && {
                        name: userDataAsJSON.name,
                        phone: userDataAsJSON.phone,
                      }),
                    });
                  }}
                  href={`whatsapp://send?text=${encodeURI(`Hey! I’m gifting you 50 Coins and a VIP Pass to enjoy exclusive access to GIFFF! 🎉🎁
        
        🚀 Join me in the Ab India Karega Trading movement!
        🔥 8 Knowledge-Packed LIVE Sessions!
        💰 Get an exclusive chance to earn Paytm Cash up to Rs. 10,000!
        
        *Don’t miss out on this amazing opportunity!*
        
        🔗 Here is the link to claim: https://tradewiseapp.com/gifff?r=${referralUrl}`)}`}
                  target="_blank"
                  className="z-50"
                >
                  <Image
                    src={"/tradewise/whatsapp.svg"}
                    width={24}
                    height={24}
                    alt="whatsapp"
                  />
                  <span>Invite via WhatsApp</span>
                </a>
              </Button>
              <p className="text-sm text-center text-balance py-1">
                Invite your friends and family, and{" "}
                <span className="text-orange-400 font-semibold">
                  earn 100 coins
                </span>{" "}
                each time they sign up!
              </p>
              <Button
                asChild
                className="bg-fuchsia-950 border-none hover:bg-fuchsia-800 mt-2 h-20 focus:text-white rounded-lg text-xl font-bold py-6 rounded-t-none flex-col"
              >
                <a
                  onClick={() => {
                    const userDataAsJSON = JSON.parse(
                      localStorage.getItem("tfu-user-auth") ?? "{}"
                    );
                    mixpanel.track("referral_shared", {
                      source: localStorage.getItem("tw-referrer")
                        ? "referral"
                        : "direct",
                      cta: "Whatsapp",
                      ...(userDataAsJSON && {
                        name: userDataAsJSON.name,
                        phone: userDataAsJSON.phone,
                      }),
                    });
                  }}
                  href={`whatsapp://send?text=${encodeURI(`Hey! I’m gifting you 50 Coins and a VIP Pass to enjoy exclusive access to GIFFF! 🎉🎁
        
        🚀 Join me in the Ab India Karega Trading movement!
        🔥 8 Knowledge-Packed LIVE Sessions!
        💰 Get an exclusive chance to earn Paytm Cash up to Rs. 10,000!
        
        *Don’t miss out on this amazing opportunity!*
        
        🔗 Here is the link to claim: https://tradewiseapp.com/gifff?r=${referralUrl}`)}`}
                >
                  <span className="flex items-center gap-x-2">
                    <Coins
                      size={18}
                      className="fill-yellow-600 text-yellow-400"
                    />
                    <span>{rewards && rewards[notEnoughCoins].points}</span>
                  </span>
                  <span className="flex items-center gap-x-1 text-sm font-semibold">
                    <Lock size={14} className="mx-1 text-white" />
                    Not Enough Coins
                  </span>
                </a>
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </section>
    );
  }
);

const RedeemPopup = ({
  reward,
  description,
  activeReward,
  setActiveReward,
}: {
  reward: string;
  description: {
    points: number;
    description: string;
    label?: string;
  };
  activeReward: string | null;
  setActiveReward: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const [input, setInput] = React.useState("");
  const { data: userData } = useSession();
  const [loading, setLoading] = React.useState(false);
  if (!activeReward) return null;

  const claimReward = async () => {
    setLoading(true);
    try {
      const userDataAsJSON = JSON.parse(
        localStorage.getItem("tfu-user-auth") ?? "{}"
      );
      mixpanel.track("gift_redeemed", {
        coins: description.points,
        gift: activeReward,
        ...(userDataAsJSON && {
          name: userDataAsJSON.name,
          phone: userDataAsJSON.phone,
        }),
      });
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API}referral/redeem`,
        {
          entity: activeReward,
          userId: userData?.user?.id,
          ...(description.label && { address: input }),
        }
      );
      toast.success(data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    } finally {
      setLoading(false);
      setActiveReward(null);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => setActiveReward(null)}>
      <DialogContent className="max-w-xs rounded-3xl gap-1">
        <DialogTitle className="text-xl text-start capitalize font-semibold flex-1">
          {reward}
        </DialogTitle>
        <DialogDescription className="text-sm">
          {description.description}
        </DialogDescription>
        {description.label && (
          <div>
            <Label htmlFor="address" className="text-sm">
              {description.label}
            </Label>
            <Input
              name="address"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        )}
        <Button
          onClick={claimReward}
          className="bg-fuchsia-950 hover:bg-fuchsia-800 mt-2 focus:text-white rounded-lg text-xl font-bold py-6"
          disabled={loading}
        >
          {loading ? (
            <Loader size={24} className="animate-spin" />
          ) : (
            <>
              Redeem for{" "}
              <Coins
                size={18}
                className="mx-2 fill-yellow-600 text-yellow-400"
              />
              {description.points}
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
