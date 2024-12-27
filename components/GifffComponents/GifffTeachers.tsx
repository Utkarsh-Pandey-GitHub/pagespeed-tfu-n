import Image from "next/image";
import { useRouter } from "next/router";

export default function GifffTeachers({
  ctaHandler,
  pageType = "paid",
  teacherData = TeacherData,
  ctaButtonClass = "",
  baseTheme = "bg-[#A62C2E]",
}: {
  ctaHandler: () => void;
  pageType?: string;
  teacherData?: any[];
  ctaButtonClass?: string;
  baseTheme?: string;
}) {
  const router = useRouter();
  const isNYTW =
    router.pathname.includes("nytw") || router.pathname.includes("nytw-free");
  return (
    <section className="w-full container relative mt-5 md:mt-10 rounded-xl py-3 max-sm:mt-18">
      <div className=" flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-center mb-2">
          Meet Tradewise&apos;s Top Experts
        </h1>
        <div className={` w-28 h-1 bg-[#A62C2E] mb-6 ${ctaButtonClass}`} />
        <p className="text-center text-gray-700 ">
          India&apos;s top experts with a verified PnL who excel not only in
          trading but also in mentoring new traders
        </p>
      </div>
      <div className="grid md:grid-cols-4 md:gap-8 gap-4 mt-8 grid-cols-2">
        {teacherData.map((teacher, index) => {
          return (
            <div
              className={` bg-opacity-10 p-4 rounded-md flex flex-col items-center justify-center gap-2 ${baseTheme}`}
              key={index}
            >
              <div className=" bg-white">
                {" "}
                <Image
                  src={teacher.src}
                  alt={teacher.name}
                  width={200}
                  height={150}
                />
              </div>

              <p className="text-center font-semibold">{teacher.name}</p>
              <div className="text-center text-sm">
                <p>{teacher.desc1}</p>
                <p>{teacher.desc2}</p>
                <p className="mt-1 font-semibold">{teacher.desc3}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full flex justify-center">
        <button
          onClick={ctaHandler}
          className={`md:w-2/3 bg-[#A62C2E] !text-[#ffffff]  py-3 text-lg font-semibold mt-8 hover:scale-105 ${ctaButtonClass} relative`}
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
              {" "}
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
    </section>
  );
}

const TeacherData = [
  {
    src: "/marketing/bld/diwaliTeachers/prabhu.webp",
    name: "Prabhu Selvaraj",
    desc1: "CEO - Stock Phoenix",
    desc2: "15 Yrs Exp",
    desc3: "Positional Trader",
  },
  {
    src: "/marketing/bld/diwaliTeachers/kamalpreet.webp",
    name: "Kamalpreet Singh",
    desc1: "CEO - Candilla Capital",
    desc2: "9 Yrs Exp",
    desc3: "Swing Trading",
  },
  {
    src: "/marketing/bld/diwaliTeachers/abhishek.webp",
    name: "Abhishek Bansal",
    desc1: "IIT Graduate",
    desc2: "Mentored 13k+ students",
    desc3: "Intraday Live Trading",
  },
  {
    src: "/marketing/bld/diwaliTeachers/pankaj.webp",
    name: "Pankaj Sahu",
    desc1: "Lord Loren Setup ",
    desc2: "scalper",
    desc3: "Intraday Scalping",
  },
  {
    src: "/marketing/bld/diwaliTeachers/aseem.webp",
    name: "Aseem Singhal",
    desc1: "India's Largest Algo",
    desc2: "Trader 8 yrs Exp",
    desc3: "ChatGPT Based Trading",
  },
  {
    src: "/marketing/bld/diwaliTeachers/bala.webp",
    name: "Balakrishna",
    desc1: "CEO - WB academy",
    desc2: "10 Yrs Exp",
    desc3: "Order Flow Analysis",
  },
  {
    src: "/marketing/bld/diwaliTeachers/heral.webp",
    name: "Hiral Shah",
    desc1: "CEO - Phoenix Commodities",
    desc2: "9 Yrs Exp",
    desc3: "Commodities Trading",
  },
  {
    src: "/marketing/bld/diwaliTeachers/jawaad.webp",
    name: "Jawaad Hussain",
    desc1: "100cr Fund Manager",
    desc2: "Institutional Trader",
    desc3: "Forex Trading",
  },
];

("Co-Founder & Chief Mentor - ");
