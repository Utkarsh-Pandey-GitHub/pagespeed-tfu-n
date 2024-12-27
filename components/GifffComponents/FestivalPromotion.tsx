import { Zap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function FestivalPromotion({
  ctaHandler,
  pageType = "paid",
  eventName = (
    <>
      Big
      <br />
      Learning Days
    </>
  ),
  listContent = [
    "Beginner traders with less then 1 year experience",
    "Individual waiting to enter stock market",
    "Traders with more then 1 year experience",
    "Working professionals who want to earn passive income",
  ],
  ctaButtonClass = "",
  baseTheme = "",
}: {
  ctaHandler: () => void;
  pageType?: string;
  eventName?: any;
  listContent?: any[];
  ctaButtonClass?: string;
  baseTheme?: string;
}) {
  const router = useRouter();
  const isNYTW =
    router.pathname.includes("nytw") || router.pathname.includes("nytw-free");
  const isBld =
    router.pathname.includes("bld") || router.pathname.includes("bld-free");
  return (
    <div
      className={`w-full mx-auto md:p-6 p-2 bg-red-600/10 rounded-lg flex flex-col items-center lg:mt-20 mt-10 max-md:pb-4 ${baseTheme} max-sm:mt-18`}
    >
      <div className="flex flex-col md:flex-row justify-between md:mb-8 items-center md:max-w-5xl gap-5  p-4">
        <h1 className="text-4xl font-bold mb-6 md:mb-0 md:w-1/2 md:pr-4 leading-[50px] hidden md:block">
          Who Should
          <br />
          Attend {eventName}
        </h1>

        <ul className="md:space-y-4 w-full md:pl-4 md:max-w-lg">
          {listContent.map((item, index) => (
            <li key={index} className="flex items-center  gap-2 mt-2">
              <div
                className={`bg-red-800 rounded-full p-2 mr-3 ${
                  isBld && "bg-[url('/marketing/bld/diya.svg')]"
                } bg-no-repeat bg-center ${ctaButtonClass}`}
              >
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={ctaHandler}
        className={`md:w-1/2 bg-[#A62C2E] !text-[#ffffff] py-3 text-lg font-semibold hover:scale-105 ${ctaButtonClass} relative`}
      >
        <Image
          src="/marketing/wwc/ctabuttonEffect.webp"
          width={30}
          height={30}
          alt=""
          className="absolute left-0 top-0 max-sm:hidden w-full h-full"
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
            Claim Your VIP Pass at{" "}
            <div className="relative ml-2 mr-2">
              ₹1000{" "}
              <div className="w-14 h-1 bg-red-500 absolute -rotate-12 top-3" />
            </div>{" "}
            ₹99
          </>
        ) : (
          "Claim Your Free VIP Pass"
        )}
      </button>
    </div>
  );
}
