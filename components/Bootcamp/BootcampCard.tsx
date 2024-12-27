import { ClockIcon } from "@heroicons/react/24/outline";
import { CalendarIcon, StarIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { motion, MotionProps } from "framer-motion";
import { cn } from "@/utils/cn";
import * as React from "react";
import mixpanel from "@/utils/mixpanel";
import Image from "next/image";

interface BootCampCardProps extends MotionProps {
  bootcamp: any;
}

export default function BootcampCard({
  bootcamp,
  ...props
}: BootCampCardProps) {
  const router = useRouter();
  let activeBatch: any;

  function getStartDate(batch: any) {
    for (let i = 0; i <= batch?.length; i++) {
      if (batch[i]?.active) {
        activeBatch = batch[i];
        const endDateTime: any = new Date(batch[i]?.endDateTime);
        const startDateTime: any = new Date(batch[i]?.startDateTime);
        const duration = Math.floor(
          Math.abs(endDateTime - startDateTime) / (1000 * 60 * 60 * 24)
        );
        return {
          startDateTime: dayjs(batch[i]?.startDateTime),
          duration: duration,
        };
      }
    }
    return { startDateTime: dayjs(), duration: 1 };
  }

  let rating = bootcamp?.teacher?.achievements?.split(";")[0];
  rating = !rating || rating === "null" ? 5 : rating;
  const students = bootcamp?.teacher?.achievements?.split(";")[2];
  const starArray = [1, 2, 3, 4, 5];

  return (
    <motion.div
      {...props}
      className="h-full flex md:max-w-[340px] w-full flex-col gap-2 justify-center items-start rounded-lg shadow-[0_0px_7.596px_0px_rgba(190,190,190,0.4)] p-5 max-xl:p-3 font-sans cursor-pointer"
      onClick={() => {
        router.push(`/bootcamps/${bootcamp?.slug}`);
        mixpanel.track("view_details", {
          page_referrer: document.referrer,
          bootcamp: bootcamp?.title,
        });
      }}
    >
      <Image
        src={bootcamp?.coverImage || "/fallback-thumbnail.webp"}
        width={980}
        height={560}
        alt="bootcamp thumbnail"
        className={cn(
          "rounded-md",
          bootcamp?.coverImage && "shadow-[0_0.9px_3.6px_0px_rgba(0,0,0,0.06)]"
        )}
      />
      <div className="flex justify-between items-center w-full max-xl:text-xs pb-2 border-b-2 border-[#ACACAC7A] border-dotted font-medium">
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-4 h-4 text-[#0A2133]" />
          <p className="text-[#606060] text-xs">
            {getStartDate(bootcamp?.Batches)?.startDateTime?.format("DD MMMM")}{" "}
            ({getStartDate(bootcamp?.Batches)?.startDateTime?.format("dddd")})
          </p>
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-4 h-4 text-[#0A2133]" />
          <p className="text-[#606060] text-xs">
            {getStartDate(bootcamp?.Batches)?.duration}{" "}
            {getStartDate(bootcamp?.Batches)?.duration > 1 ? "days" : "day"}
          </p>
        </div>
      </div>

      <div className="flex flex-row gap-2 justify-between items-center w-full max-xl:text-xs font-medium">
        <div className="flex flex-wrap gap-1">
          {bootcamp?.categories?.length > 0 ? (
            bootcamp?.categories?.map((category: any, index: number) => (
              <React.Fragment key={category?.id}>
                <p className="text-xs text-[#606060] capitalize">
                  {category.name}
                </p>
                {bootcamp?.categories?.length > 1 &&
                  index !== bootcamp?.categories?.length - 1 && (
                    <span className="text-xs text-[#606060]"> | </span>
                  )}
              </React.Fragment>
            ))
          ) : (
            <p className="text-xs text-[#606060] capitalize">Finance</p>
          )}
        </div>
        <div className="flex flex-row justify-center items-center gap-1">
          <div className="flex flex-row justify-center items-center">
            {rating && rating != "null"
              ? starArray.map((stars: number, index: number) => {
                  if (stars <= rating) {
                    return (
                      <StarIcon
                        key={index}
                        className="w-3 h-3 text-[#FFA135]"
                      />
                    );
                  } else {
                    return (
                      <StarIcon
                        key={index}
                        className="w-3 h-3 text-[#F9D4AB]"
                      />
                    );
                  }
                })
              : starArray.map((stars: number, index: number) => {
                  return (
                    <StarIcon key={index} className="w-3 h-3 text-[#FFA135]" />
                  );
                })}
          </div>
          <p className="text-[#606060] text-xs text-nowrap">
            {rating && rating != "null"} (
            {parseInt(students) > 1000
              ? `${Math.floor(parseInt(students) / 1000)}k+`
              : "10k+"}
            )
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-between h-full w-full">
        <h4 className="font-semibold md:text-lg md:w-[300px] multiline-ellipsis">
          {bootcamp?.title}
        </h4>
        <div className="flex justify-between items-center w-full mt-2">
          <div className="flex gap-1 items-center relative">
            <h4 className="text-[#FF7426] font-semibold text-lg">
              {`₹${bootcamp?.discountedPrice?.toLocaleString()}`}
            </h4>
            <p className="flex flex-col justify-center text-[#606060] text-sm line-through">
              {`₹${bootcamp?.price?.toLocaleString()}`}
            </p>
          </div>
          <Button
            size={"sm"}
            className="rounded font-bold font-inter px-6 py-1.5"
            onClick={() => {
              router.push(`/bootcamps/${bootcamp?.slug}`);
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
