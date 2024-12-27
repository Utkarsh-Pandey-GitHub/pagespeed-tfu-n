import {
  ChatBubbleOvalLeftEllipsisIcon,
  PlayCircleIcon,
  StarIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import NewLeadForm from "./New-lead-form";
import { useEffect, useRef } from "react";
import Image from "next/image";

export default function Instructor({
  data,
  scroll,
  setScroll,
  offerEndTime,
}: {
  data: any;
  scroll: boolean;
  setScroll: React.Dispatch<any>;
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
  return (
    <>
      <div className="py-3 flex flex-col gap-5">
        <h4 className="text-[#002082] font-semibold">Instructor</h4>
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-col gap-3 justify-start items-start">
            <div>
              <p className="font-semibold">
                {data?.masterClass?.bootcamp?.teacher?.name?.toUpperCase()}
              </p>
              <p>Trading Expert</p>
            </div>
            <div className="flex flex-row justify-center items-center gap-3">
              <Image
                src={data?.masterClass?.bootcamp?.teacher?.photo}
                width={80}
                height={80}
                alt="teacher's photo"
                className="rounded-full object-cover"
              />
              <div className="flex flex-col justify-center items-start">
                <div className="flex flex-row justify-center items-center gap-1">
                  <StarIcon className="w-5 h-5 text-[#23282E]" />
                  <p className="text-[#23282E]">
                    {" "}
                    {
                      data?.masterClass?.bootcamp?.teacher?.achievements?.rating
                    }{" "}
                    Instructor Rating
                  </p>
                </div>
                <div className="flex flex-row justify-center items-center gap-1">
                  <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5 text-[#23282E]" />
                  <p className="text-[#23282E]">
                    {" "}
                    {
                      data?.masterClass?.bootcamp?.teacher?.achievements
                        ?.reviews
                    }{" "}
                    Reviews
                  </p>
                </div>
                <div className="flex flex-row justify-center items-center gap-1">
                  <UserIcon className="w-5 h-5 text-[#23282E]" />
                  <p className="text-[#23282E]">
                    {" "}
                    {
                      data?.masterClass?.bootcamp?.teacher?.achievements
                        ?.students
                    }{" "}
                    Students
                  </p>
                </div>
                <div className="flex flex-row justify-center items-center gap-1">
                  <PlayCircleIcon className="w-5 h-5 text-[#23282E]" />
                  <p className="text-[#23282E]">
                    {" "}
                    {
                      data?.masterClass?.bootcamp?.teacher?.achievements
                        ?.courses
                    }{" "}
                    Courses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-start items-start gap-1">
          <h4 className="font-semibold">Introduction</h4>
          <p>{data?.masterClass?.bootcamp?.teacher?.bio}</p>
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
