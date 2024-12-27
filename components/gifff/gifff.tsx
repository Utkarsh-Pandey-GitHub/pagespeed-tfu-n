import GifffButton from "./button";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { ArrowRightCircle, Circle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Accordion as FAQAccordion,
  AccordionContent as FAQAccordionContent,
  AccordionItem as FAQAccordionItem,
  AccordionTrigger as FAQAccordionTrigger,
} from "../ui/faq-accordion";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { DashboardData } from "@/pages/gifff/dashboard";
import mixpanel from "@/utils/mixpanel";
import useKey from "@/hooks/use-key";
import { Button } from "../ui/button";
import Link from "next/link";

const gifffDescription = [
  <div>
    India had been a free country for 78 years. But do you think you are{" "}
    <b>financially free</b>? No, right?
  </div>,
  <div>
    Join the <b>Financial freedom festival</b> to connect with India's top
    experts and create your 1Cr trading plan.
  </div>,
  <div>
    Attend Live Sessions, Workshops, Trading trivias, and Live market sessions
    to <b>win Cash Prizes</b> on Paytm.
  </div>,
  <div>
    This <b>4 day event</b> is your final stop on becoming Financially Free!
  </div>,
];

const scheduleData = [
  {
    title: "Swing trading for your Financial freedom",
    items: [
      {
        label: "Opening and onboarding for festival",
        description: "Join the 4 day event toEarn up to ₹10,000",
      },
      {
        label: "Live Classes with Swing trading experts",
        description: "Live sessions with Swing trading experts",
      },
    ],
  },
  {
    title: "All day Intraday",
    items: [
      {
        label: "Live Trading session",
        description: "Live trading session with Swing trading experts",
      },
      {
        label: "Best intraday Indicator",
        description: "Best intraday indicator",
      },
    ],
  },
  {
    title: "Forex and Commodities",
    items: [
      {
        label: "Commodity trading class",
        description: "Live trading session with Swing trading experts",
      },
      { label: "Trading contest", description: "Trading contest" },
      {
        label: "Forex trading funded account",
        description: "Forex trading funded account",
      },
    ],
  },
  {
    title: "A day with Institutional Traders",
    items: [
      {
        label: "Live Trading session",
        description: "Live trading session with Swing trading experts",
      },
    ],
  },
];

const faqs = [
  {
    question: "What is GIFFF?",
    answer:
      "GIFFF is a platform that offers a unique opportunity to learn and earn through swing trading.",
  },
  {
    question: "How do I get started?",
    answer:
      "To get started, simply sign up for our 4-day event and begin your journey to financial freedom.",
  },
  {
    question: "What kind of training is provided?",
    answer:
      "Our training includes live sessions with swing trading experts, access to the best intraday indicators, and more.",
  },
  {
    question: "Is it suitable for beginners?",
    answer:
      "Yes, our platform is designed to be accessible to everyone, regardless of their trading experience.",
  },
];

export default function Gifff({
  switchTab,
  className,
  dashboardData,
}: {
  switchTab: (tab: string) => void;
  className?: string;
  dashboardData: DashboardData | null;
}) {
  return (
    <section className={cn("grid gap-8 p-2", className)}>
      <div className="px-4 grid gap-3">
        <h1 className="text-2xl mt-6 font-semibold mx-auto">
          #AbIndiaKaregaTrading
        </h1>
        <Image
          src={"/gifff/india-wave-bg.png"}
          width={1200}
          height={1200}
          alt="india-wave"
          className="absolute h-20 top-48 -left-36 w-full -z-10 opacity-60"
        />
        <Image
          src={"/gifff/india-wave-bg.png"}
          width={1200}
          height={1200}
          alt="india-wave"
          className="absolute h-20 top-72 -right-36 w-full -z-10 opacity-60"
        />
        <iframe
          src="https://www.youtube-nocookie.com/embed/g8klJwjUzrM?si=6sjfZOljSZcgjCwn"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full aspect-video rounded-2xl"
        ></iframe>
        <GifffButton
          onClick={() => {
            const userDataAsJSON = JSON.parse(
              localStorage.getItem("tfu-user-auth") ?? "{}"
            );

            mixpanel.track("Earn_upto_Rs10000", {
              position: "top",
              name: userDataAsJSON.name,
              email: userDataAsJSON.email,
            });
            switchTab("refer");
          }}
          size={"lg"}
          className="text-xl py-3 font-normal h-auto rounded-lg"
        >
          Earn upto ₹10,000
        </GifffButton>
      </div>

      <CustomGiffButton />

      <WhatIsGifff />

      {/* Detailed 4 day schedule */}
      <Image
        src={"/gifff/schedule.svg"}
        width={1200}
        height={1200}
        unoptimized
        alt="schedule"
      />
      <div className="sticky bottom-0 grid place-items-center bg-gradient-to-t backdrop-blur-sm from-white/50 to-white/10 z-20">
        <GifffButton
          onClick={() => {
            const userDataAsJSON = JSON.parse(
              localStorage.getItem("tfu-user-auth") ?? "{}"
            );
            mixpanel.track("Earn_upto_Rs10000", {
              position: "mid",
              name: userDataAsJSON.name,
              email: userDataAsJSON.email,
            });
            switchTab("refer");
          }}
          size={"lg"}
          className="text-xl w-full py-3 font-normal h-auto rounded-lg my-4"
        >
          Earn upto ₹10,000
        </GifffButton>
      </div>
      <FAQs />
    </section>
  );
}

const Schedule = () => {
  return (
    <div className="px-4 grid gap-3 place-items-center">
      <h2 className="text-xl font-extrabold text-sky-950">
        Detailed 4 day schedule
      </h2>
      <div className="h-1 w-24 bg-fuchsia-950" />

      <div className="relative grid gap-2">
        {scheduleData.map((day, index) => (
          <div key={index} className="relative space-y-2">
            {index !== scheduleData.length - 1 && (
              <div className="absolute left-0 top-8 h-full w-0.5 bg-fuchsia-900" />
            )}

            <div className="absolute -left-3 top-3 size-6 bg-fuchsia-950 rounded-full z-20" />
            <h3 className="text-lg pl-6 font-bold text-sky-950">
              Day {index + 1}: {day.title}
            </h3>
            <Accordion type="multiple" className="pl-6 space-y-2">
              {day.items.map((item, itemIndex) => (
                <AccordionItem
                  key={itemIndex}
                  value={item.label}
                  className="border rounded-xl p-4"
                >
                  <AccordionTrigger className="border-none p-0 hover:no-underline">
                    {item.label}
                  </AccordionTrigger>
                  <AccordionContent className="p-0 mt-4">
                    {item.description}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FAQs = () => {
  return (
    <div className="px-4 grid gap-3 place-items-center">
      <h2 className="text-xl font-extrabold text-sky-950">
        Frequently Asked Questions
      </h2>
      <div className="h-1 w-24 bg-fuchsia-950" />

      <FAQAccordion type="multiple" className="w-full space-y-4">
        {faqs.map((faq, index) => (
          <FAQAccordionItem
            key={index}
            value={faq.question}
            className="border bg-gray-100 rounded-xl p-4"
          >
            <FAQAccordionTrigger
              onClick={() => {
                const userDataAsJSON = JSON.parse(
                  localStorage.getItem("tfu-user-auth") ?? "{}"
                );
                mixpanel.track("faq_viewed", {
                  question: faq.question,
                  ...(userDataAsJSON.email && {
                    phone: userDataAsJSON.phone,
                    name: userDataAsJSON.name,
                  }),
                });
              }}
              className="border-none bg-transparent p-0 hover:no-underline"
            >
              Q. {faq.question}
            </FAQAccordionTrigger>
            <FAQAccordionContent className="p-0 mt-4">
              {faq.answer}
            </FAQAccordionContent>
          </FAQAccordionItem>
        ))}
      </FAQAccordion>
    </div>
  );
};

export const WhatIsGifff = () => {
  return (
    <div className="px-4 grid gap-3 place-items-center z-30 bg-white">
      <h2 className="text-xl font-extrabold text-sky-950">What is GIFFF?</h2>
      <div className="h-1 w-24 bg-fuchsia-950" />

      <div className="bg-fuchsia-900/10 border-fuchsia-900/10 border-2 rounded-xl p-4">
        <Table className="p-0">
          <TableBody>
            {gifffDescription.map((description, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                <TableCell className="flex items-center gap-2 p-2">
                  <ArrowRightCircle size={24} />
                  <span className="flex-1">{description}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const CustomGiffButton = () => {
  const buttonData = useKey<{
    label: string;
    url: string;
    title: string;
    show: boolean;
    topTitle: string;
    live: boolean;
  }>("gifff-button", { json: true });

  if (!buttonData || !buttonData.show) return null;

  return (
    <section className="bg-gradient-to-br p-3 grid gap-4 place-items-center from-orange-500/50 via-white to-green-500/50 rounded-xl mx-4">
      <div className="flex w-full items-center justify-between">
        <span className="font-semibold">{buttonData.topTitle}</span>
        {buttonData.live && (
          <span className="font-semibold text-red-500">
            <Circle
              size={12}
              color="red"
              className="fill-red-500 size-1 animate-ping mr-2 inline"
            />
            LIVE
          </span>
        )}
      </div>
      <h3>{buttonData.title}</h3>
      <Button
        asChild
        className="bg-fuchsia-950 hover:bg-fuchsia-900 rounded-lg w-full h-12 text-xl"
        size={"lg"}
      >
        <Link href={buttonData.url}>{buttonData.label}</Link>
      </Button>
    </section>
  );
};
