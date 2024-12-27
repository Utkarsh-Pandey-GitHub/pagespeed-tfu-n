import React from "react";
import { Clock, Target, Coins } from "lucide-react";
import { useRouter } from "next/router";
import Image from "next/image";

const RoadmapItem = ({
  imgSrc,
  title,
  subtitle,
  roadmapItemClass,
}: {
  imgSrc: any;
  title: string;
  subtitle: string;
  roadmapItemClass: string;
}) => (
  <div className="flex md:flex-col items-center md:text-center md:w-1/3 max-md:p-3 max-md:mr-4 max-md:z-10 max-md:mb-8">
    <div
      className={`${roadmapItemClass} rounded-full p-3 md:mb-4 max-md:mr-4 relative z-10 max-sm:absolute `}
    >
      <img src={imgSrc} alt="icons" className=" w-7 h-7" />
    </div>
    <div className="max-sm:ml-16">
      <h3 className="text-xl font-bold md:mb-2">{title}</h3>
      <p className="text-gray-600 md:text-sm">{subtitle}</p>
    </div>
  </div>
);
const defaultRoadmapData = [
  {
    imgSrc: "/marketing/bld/kalash.svg",
    title: "Proven Muhurat Trading Strategy",
    subtitle: "A step-by-step guide to make the most of the special session.",
  },
  {
    imgSrc: "/marketing/bld/calender.svg",
    title: "November & December Trading Insights",
    subtitle: "Stay ahead with strategies to close the year on a high.",
  },
  {
    imgSrc: "/marketing/bld/interaction.svg",
    title: "Live Interaction with Top Traders",
    subtitle: "Get your questions answered in real-time by experts.",
  },
];
const RoadmapToSuccess = ({
  ctaHandler,
  pageType = "paid",
  roadmapData = defaultRoadmapData,
  ctaButtonClass = "bg-[#A62C2E] !text-[#ffffff]",
  roadmapItemClass = "bg-[#A62C2E]",
}: {
  ctaHandler: () => void;
  pageType?: string;
  roadmapData?: any;
  ctaButtonClass?: string;
  roadmapItemClass?: string;
}) => {
  const router = useRouter();
  const isNYTW =
    router.pathname.includes("nytw") || router.pathname.includes("nytw-free");
  return (
    <div className="md:w-full max-md:max-w-2xl  mx-auto md:p-6  mt-10 md:mt-16 max-sm:mt-18 ">
      <h1 className="text-3xl font-bold text-navy-900 mb-12 text-center max-md:px-4 max-md:text-center max-md:text-2xl">
        Your Roadmap to Success
      </h1>
      <div className="relative mb-16">
        <div
          className={`absolute top-6 left-0 right-0 border-t-2  border-dashed max-md:hidden ${roadmapItemClass}`}
        />
        <div
          className={`absolute left-9 top-0 bottom-0 border-l-2  border-dashed md:hidden ${roadmapItemClass}`}
          style={{ marginLeft: "1px" }}
        />
        <div className="md:flex md:justify-between md:relative">
          {roadmapData.map((item: any, index: number) => (
            <RoadmapItem
              imgSrc={item.imgSrc}
              title={item.title}
              subtitle={item.subtitle}
              roadmapItemClass={roadmapItemClass}
            />
          ))}
        </div>
      </div>
      <div className=" w-full flex justify-center items-center">
        <button
          onClick={ctaHandler}
          className={`md:w-1/2  py-3 text-lg font-semibold hover:scale-105 ${ctaButtonClass} relative`}
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
    </div>
  );
};

export default RoadmapToSuccess;
