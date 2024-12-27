import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TimeLineData from "@/marketingUtils/timeline.json";
import { Circle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Curriculum({
    ctaHandler,
    pageType = "paid",
    days = 2,
    textStyle = "text-[#A62C2E]",
    ctaButtonClass = "bg-[#A62C2E] !text-[#ffffff]",
    timelineStyle = "bg-[#A62C2E]",
    timelineData = TimeLineData.modules
}: {
  ctaHandler: () => void;
  pageType?: string;
  days?: number;
  textStyle?: string;
  ctaButtonClass?: string;
  timelineStyle?: string;
  timelineData?: any[];
}) {
  const router = useRouter();
  const isNYTW =
    router.pathname.includes("nytw") || router.pathname.includes("nytw-free");
  return (
    <div className="grid md:grid-cols-3 gap-x-8 place-items-start relative p-4 max-w-6xl w-full mx-auto md:py-16 max-md:mb-4 lg:mt-20 max-sm:mt-18">
      <Card className="md:sticky md:top-24 md:bg-gray-50 border-none max-md:mb-4">
        <CardHeader className="flex items-center">
          <Image
            src="/gifff/calendar.png"
            alt="calendar photo"
            height={50}
            width={50}
          />
          <CardTitle className="text-3xl text-center font-bold">
            Detailed {days} day
            <span className={`${textStyle}`}> Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          <button
            onClick={ctaHandler}
            className={`  hover:scale-105 py-3 text-lg font-semibold ${ctaButtonClass} relative`}
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
            {pageType === "paid"
              ? "Claim Your VIP Pass at ₹99"
              : "Claim Your Free VIP Pass"}
          </button>
        </CardContent>
      </Card>
      <div className="md:col-span-2 w-full flex flex-col gap-6 relative">
        <div
          className={`absolute w-0.5 h-full top-0.5 left-[16px] -z-10 ${timelineStyle}`}
        />
        {timelineData.map(
          (module, index) =>
            index < days && (
              <div key={index}>
                <div className="flex items-center gap-4">
                  <Circle
                    className={`text-2xl w-8 h-8 rounded-full ${timelineStyle} absolute `}
                    color="#ffffff"
                  />
                  <h3 className="text-lg font-bold ml-10">{module.module_Day}</h3>
                </div>

                <Accordion
                  type="single"
                  collapsible
                  className="md:w-full ml-12"
                >
                  {(module.detailed_Day as any[]).map((topic, i) => (
                    <AccordionItem
                      value={`item-${i}`}
                      key={i}
                      className="border rounded-lg my-2 hover:border-blue-50"
                    >
                      <div className="flex px-4 gap-2 cursor-pointer py-3 hover:bg-blue-50 flex-col">
                        {topic.time ? (
                          <div className="text-lg font-semibold">
                            {topic.time}
                          </div>
                        ) : null}
                        <h4 className="text-lg font-medium text-left">
                          {topic.heading}
                        </h4>
                      </div>
                      <AccordionContent className="px-6 bg-white mt-2">
                        <ul className="list-disc list-inside">
                          {(topic?.details as any[])?.map((detail, i) => (
                            <li key={i}>{detail}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )
        )}
      </div>
    </div>
  );
}
