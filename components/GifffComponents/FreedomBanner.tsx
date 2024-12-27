import Image from "next/image";
import { Button } from "../ui/button";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const CountdownTimer = ({ endDate }: { endDate: string }) => {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const calculateTimeLeft = (): TimeLeft => {
      const difference = +new Date(endDate) - +new Date();
      let timeLeft: TimeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return timeLeft;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex space-x-2 text-xl font-bold mt-6 max-md:items-center max-md:justify-center md:pb-4">
      {(["days", "hours", "minutes", "seconds"] as const).map((unit, index) => (
        <div className="flex flex-row gap-2 items-center" key={unit}>
          <div className="flex flex-col items-center">
            <div className="flex">
              <span className="w-8 text-center">
                {String(timeLeft[unit]).padStart(2, "0")}
              </span>
            </div>
            <span className="text-sm font-normal">{unit.toUpperCase()}</span>
          </div>
          {index < 3 && <p className="text-xl">:</p>}
        </div>
      ))}
    </div>
  );
};

export default function FinancialFreedomBanner({
  ctaHandler,
  pageType = "paid",
  ctaButtonClass = "bg-[#A62C2E] !text-[#ffffff]",
  taglineClass = "text-[#A62C2E]",
  eventName = <> Diwali Trading Week</>,
  baseTheme = "",
  endDate = "2021-11-04T00:00:00",
}: {
  ctaHandler: () => void;
  pageType?: string;
  ctaButtonClass?: string;
  taglineClass?: string;
  eventName?: any;
  baseTheme?: string;
  endDate?: string;
}) {
  const router = useRouter();
  const isNYTW =
    router.pathname.includes("nytw") || router.pathname.includes("nytw-free");
  return (
    <div
      className={`bg-red-600/10 md:px-6 pt-6 rounded-lg md:flex-row flex flex-col items-center md:justify-between justify-center max-md:pb-6  max-md:px-2 ${baseTheme} max-sm:mt-18`}
    >
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-navy-900 mb-4 max-md:text-center">
          Boost your trading game in our {eventName}
        </h1>
        <p className="text-gray-700 mb-2 max-md:text-center">
          India's Largest Trading Conclave is here. Get ready to indulge in a
          complete 3 day event <br /> and boost your trading journey.
        </p>
        <p className={` font-semibold mb-4 max-md:text-center ${taglineClass}`}>
          #AbIndiaKaregaTrade
        </p>
        <div className="flex items-center mt-4 max-md:hidden">
          <Button
            className={`hover:scale-105 px-6 py-2 rounded-md font-semibold relative overflow-clip ${ctaButtonClass}`}
            onClick={ctaHandler}
          >
            <Image
              src="/marketing/wwc/ctabuttonEffect.webp"
              width={30}
              height={30}
              alt=""
              className="absolute left-0 top-0 w-full h-full"
            />
            {!isNYTW ? (
              <>
                <Image
                  src="/marketing/wwc/snowflake1.svg"
                  width={30}
                  height={30}
                  alt=""
                  className="absolute left-7 top-0 max-sm:hidden"
                />
                <Image
                  src="/marketing/wwc/snowflake2.svg"
                  width={30}
                  height={30}
                  alt=""
                  className="absolute left-2 top-6 max-sm:hidden"
                />
              </>
            ) : null}
            <div className="absolute inset-0 bg-[linear-gradient(110deg,#00000000,45%,#ffffff80,55%,#00000000)] bg-[length:200%_100%] animate-shimmer rounded-md" />
            {pageType === "paid" ? (
              <>
                Claim Your VIP pass at{" "}
                <div className="relative ml-2 mr-2">
                  ₹1000{" "}
                  <div className="w-12 h-1 bg-red-500 absolute -rotate-12 top-2" />
                </div>{" "}
                ₹99
              </>
            ) : (
              "Claim Your Free VIP Pass"
            )}
          </Button>
          <img
            src="/Common/Long-Free/svg/review_people.svg"
            className="h-10 ml-3"
          />
          <div className="flex items-center ml-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
            ))}
            <span className="text-sm ml-1">14k+ reviews</span>
          </div>
        </div>

        <div className="w-full flex items-center justify-center md:hidden">
          <Button
            className={` hover:scale-105 px-10  py-6 rounded-md font-semibold text-lg relative ${ctaButtonClass}`}
            onClick={ctaHandler}
          >
            <div className="absolute inset-0 bg-[linear-gradient(110deg,#00000000,45%,#ffffff80,55%,#00000000)] bg-[length:200%_100%] animate-shimmer rounded-md" />
            {pageType === "paid" ? (
              <>
                Claim Your VIP pass at{" "}
                <div className="relative ml-2 mr-2">
                  ₹1000{" "}
                  <div className="w-14 h-1 absolute -rotate-12 top-3 bg-red-600" />
                </div>{" "}
                ₹99
              </>
            ) : (
              "Claim Your Free VIP Pass"
            )}
          </Button>
        </div>
        <CountdownTimer endDate={endDate} />
      </div>

      <div className="hidden md:block ">
        <Image
          src="/gifff/smilingman.png"
          alt="Smiling man"
          className="rounded-lg bottom-0"
          height={250}
          width={250}
        />
      </div>
    </div>
  );
}
