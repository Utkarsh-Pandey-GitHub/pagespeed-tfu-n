import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Calendar,
  Check,
  Coins,
  Copy,
  MinusCircle,
  PlusCircle,
  Share2,
} from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "../ui/badge";
import dayjs from "dayjs";
import { cn } from "@/utils/cn";
import { DashboardData } from "@/pages/gifff/dashboard";
import mixpanel from "@/utils/mixpanel";

export default function ReferAndEarn({
  className,
  dashboardData,
}: {
  className?: string;
  dashboardData: DashboardData | null;
}) {
  const referralUrl = dashboardData?.referralId;
  return (
    <section className={cn("grid gap-8 bg-gray-100", className)}>
      <div className="mb-16">
        <Card className="bg-white relative top-16 z-20 w-[90%] mx-auto rounded-2xl border-0 shadow">
          <CardHeader className="space-y-4">
            <CardTitle className="font-semibold text-3xl text-center mx-auto">
              Sharing is{" "}
              <span className="relative">
                caring
                <Image
                  src="/gifff/line-through.svg"
                  alt=""
                  width={100}
                  height={20}
                  className="absolute inset-0 top-1/2"
                />
              </span>{" "}
              <div className="text-orange-500 italic">earning</div>
            </CardTitle>

            <CardDescription className="text-lg text-black px-6 text-center mx-auto">
              Invite your friends and family, and{" "}
              <span className="font-semibold text-orange-500">
                earn 100 coins
              </span>{" "}
              each time they sign up!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/gifff?r=${referralUrl}`
                );
                const userDataAsJSON = JSON.parse(
                  localStorage.getItem("tfu-user-auth") ?? "{}"
                );
                mixpanel.track("referral_link_copied", {
                  source: localStorage.getItem("tw-referrer")
                    ? "referral"
                    : "direct",
                  ...(userDataAsJSON?.name && {
                    name: userDataAsJSON?.name,
                    phone: userDataAsJSON?.phone,
                  }),
                });
                toast.success("Copied to Clipboard");
              }}
              className="flex items-center mx-auto justify-between px-4 bg-gray-100 p-4 rounded-xl relative"
            >
              <p className="text-sm text-gray-500">
                tradewiseapp.com/gifff?r={referralUrl}
              </p>
              <Button
                variant={"ghost"}
                className="flex items-center gap-1 bg-gray-100/10 backdrop-blur absolute right-4 "
              >
                <span className="text-lg">Copy</span>
                <Copy size={16} />
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              className="flex w-full gap-2 mx-auto rounded-lg bg-green-500 font-normal items-center px-4"
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
                    ...(userDataAsJSON?.name && {
                      name: userDataAsJSON?.name,
                      phone: userDataAsJSON?.phone,
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
          </CardFooter>
        </Card>
        <Image
          src={"/gifff/india-bg.jpeg"}
          width={600}
          height={600}
          alt="india-bg"
          className="w-full h-3/5 object-cover object-top absolute inset-0"
        />
      </div>

      <Rewards />
      {dashboardData?.transactions ? (
        <CoinHistory transactions={dashboardData?.transactions} />
      ) : null}
    </section>
  );
}

const rewards = [
  {
    coins: 50,
    description: "Successfully Registered",
    status: (
      <Badge className="rounded-3xl hover:bg-fushcia-950/20 py-1 h-8 bg-fuchsia-950/20 text-fuchsia-950 font-bold px-3">
        <Check size={14} className="mr-2" />
        Done
      </Badge>
    ),
  },
  {
    coins: 100,
    description: "Refer your friends",
    status: (
      <Badge className="rounded-3xl py-1 h-8 bg-fuchsia-950 hover:bg-fuchsia-950 px-3">
        <Share2 size={14} className="mr-2" />
        Share
      </Badge>
    ),
    onclick: async () => {
      const data = {
        title: "Join me on Gifff!",
        text: "Join me on Tradewise!",
        url: "https://tradewiseapp.com/gifff",
      };
      try {
        await navigator.share(data);
        const userDataAsJSON = JSON.parse(
          localStorage.getItem("tfu-user-auth") ?? "{}"
        );
        mixpanel.track("referral_shared", {
          source: localStorage.getItem("tw-referrer") ? "referral" : "direct",
          cta: "Share",
          ...(userDataAsJSON?.name && {
            name: userDataAsJSON?.name,
            phone: userDataAsJSON?.phone,
          }),
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    },
  },
  { coins: 50, description: "Each day you attend the event" },
  {
    coins: 50,
    description: "Each day your friend attends the event",
  },
];

function Rewards() {
  return (
    <section className="grid gap-4 place-items-center px-4">
      <h2 className="text-2xl">How it works?</h2>

      {rewards.map((reward, index) => (
        <Card
          onClick={reward?.onclick}
          key={index}
          className="bg-white w-full shadow border-0 rounded-xl flex items-center justify-between py-2 cursor-pointer"
        >
          <CardHeader className="p-3 space-y-0">
            <CardDescription className="text-md flex items-center gap-1">
              <Coins className="text-yellow-500" />
              <span>{reward.coins} coins</span>
            </CardDescription>
            <CardTitle className="text-base font-medium">
              {reward.description}
            </CardTitle>
          </CardHeader>
          <CardFooter className="grid p-0 px-3 place-items-center">
            {reward.status}
          </CardFooter>
        </Card>
      ))}
    </section>
  );
}

const descriptions = (transaction: {
  createdAt: string;
  type: string;
  typeEntity: string;
  points: number;
  joinedUser?: {
    name: string;
  };
}) => {
  return {
    JOINED: "Gift for joining the event",
    REFERRED: (
      <div>
        <span className="capitalize font-semibold">
          {transaction.joinedUser?.name}
        </span>{" "}
        joined the event
      </div>
    ),
    CLASS_JOINING: "You attended a class",
    REFERRED_CLASS_JOINED: (
      <div>
        <span className="capitalize font-semibold">
          {transaction.joinedUser?.name}
        </span>{" "}
        joined the class
      </div>
    ),
    ...(transaction.type === "REDEEMED" && {
      [transaction.typeEntity]: (
        <div className="capitalize">
          You redeemed {transaction.typeEntity.toLowerCase()}
        </div>
      ),
    }),
  };
};

function CoinHistory({
  transactions,
}: {
  transactions: {
    createdAt: string;
    type: string;
    typeEntity: string;
    points: number;
    joinedUser?: {
      name: string;
    };
  }[];
}) {
  return (
    <section className="grid place-items-center gap-4 w-full p-4">
      <h2>Coin History</h2>
      {transactions?.map((transaction, index) => (
        <Card key={index} className="w-full p-4 bg-white border-none">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              <Calendar className="inline mr-2" size={16} />
              {dayjs(transaction.createdAt).format("DD MMM YYYY, h:mmA")}
            </span>
            <span
              className={`font-bold flex items-center gap-1 ${
                transaction.points < 0 ? "text-red-500" : "text-green-500"
              }`}
            >
              {transaction.points < 0 ? (
                <MinusCircle size={16} />
              ) : (
                <PlusCircle size={16} />
              )}
              <span>{Math.abs(transaction.points)} coins</span>
            </span>
          </div>
          <div className="font-medium">
            {
              descriptions(transaction)[
                transaction.typeEntity as unknown as keyof typeof descriptions
              ]
            }
          </div>
        </Card>
      ))}
    </section>
  );
}
