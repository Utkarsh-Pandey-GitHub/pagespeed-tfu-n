import {
  PuzzlePieceIcon,
  TrophyIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import NewLeadForm from "./New-lead-form";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { audienceTypes } from "@/components/Bootcamp/Overview";

const TABS = {
  OVERVIEW: "overview",
  INSTRUCTOR: "instructor",
  CURRICULUM: "curriculum",
  HELP: "help",
  REVIEW: "review",
};

export default function Overview({
  data,
  scroll,
  setScroll,
  setIsActive,
  offerEndTime,
}: {
  data: any;
  scroll: boolean;
  setScroll: React.Dispatch<any>;
  setIsActive: React.Dispatch<any>;
  offerEndTime: any;
}) {
  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scroll === true) {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        setScroll(false);
      }, 100);
    }
  }, [scroll]);

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-5 py-3">
        <h4 className="text-[#002082] font-semibold">Instructor</h4>
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-row gap-2 justify-start items-center">
            <Image
              src={data?.masterClass?.bootcamp?.teacher?.photo}
              width={80}
              height={80}
              alt="teacher's photo"
              className="rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">
                {data?.masterClass?.bootcamp?.teacher?.name?.toUpperCase()}
              </p>
              <p>Trading Expert</p>
            </div>
          </div>
          <button
            className="bg-[#0020821C] text-[#23282E] rounded-full border-none"
            onClick={() => setIsActive(TABS.INSTRUCTOR)}
          >
            View
          </button>
        </div>
        <p className="text-[#23282E]">
          {data?.masterClass?.description?.length > 200
            ? data?.masterClass?.description.substring(0, 200)
            : data?.masterClass?.description}
          {data?.masterClass?.description?.length > 200 && (
            <button
              className={`border-none p-0 ${isExpanded ? "hidden" : ""}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              ...read more
            </button>
          )}
          {isExpanded && (
            <>
              <span>{data?.masterClass?.description?.substring(120)}</span>
              <button
                className={`border-none p-0 ${!isExpanded ? "hidden" : ""}`}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                ...read less
              </button>
            </>
          )}
        </p>

        <h4 className="text-[#002082] font-semibold">
          Who is this Masterclass for
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {audienceTypes?.map((audience) => (
            <Card
              key={audience.type}
              className={`${audience.bgColor} text-center`}
            >
              <CardContent className="p-4">
                <Image
                  src={`/tradewise/${audience.type.toLowerCase()}.gif`}
                  height={100}
                  width={100}
                  alt={audience.type}
                  className="mx-auto mb-2"
                />
                <p className="font-semibold">{audience.type}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-[#23282E]">
          Anyone and everyone who is genuinely interested to make money in the
          stock market can attend this webinar.
        </p>

        <div
          className="prose prose-h1:text-[#002082] prose-h1:text-base prose-h2:text-base prose-h2:text-[#002082] prose-h3:text-[#002082] prose-h4:text-[#002082] prose-p:font-inter prose-p:text-[#23282E]"
          dangerouslySetInnerHTML={{
            __html: data?.masterClass?.learnings,
          }}
        ></div>

        <div className="flex flex-col bg-[#F3F6FF] p-5 rounded-lg gap-1 border-l-2 border-black">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Live Session</p>
            <VideoCameraIcon className="w-11 h-11 bg-[#DEE7FF] p-2 rounded-full" />
          </div>
          <p className="text-[#8CA2C0]">
            We provide live classes to our students. You can attend the classes
            from anywhere in the world.
          </p>
        </div>
        <div className="flex flex-col bg-[#F3F6FF] p-5 rounded-lg gap-1 border-l-2 border-black">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Gamified Approach</p>
            <PuzzlePieceIcon className="w-11 h-11 bg-[#DEE7FF] p-2 rounded-full" />
          </div>
          <p className="text-[#8CA2C0]">
            We save all the session recordings in case you miss a class or want
            to rewatch a class.
          </p>
        </div>
        <div className="flex flex-col bg-[#F3F6FF] p-5 rounded-lg gap-1 border-l-2 border-black">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Win Prizes upto ₹10,000</p>
            <TrophyIcon className="w-11 h-11 bg-[#DEE7FF] p-2 rounded-full" />
          </div>
          <p className="text-[#8CA2C0]">
            Things are better when you do them with others. We have a
            communities of 1000+ students who are learning together.
          </p>
        </div>

        <div ref={formRef}>
          <NewLeadForm
            data={data}
            scroll={scroll}
            offerEndTime={offerEndTime}
          />
        </div>
      </div>
    </>
  );
}
