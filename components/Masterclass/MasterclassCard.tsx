import { ClockIcon } from "@heroicons/react/24/outline";
import { CalendarIcon, StarIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { MotionProps, motion } from "framer-motion";
import { cn } from "@/utils/cn";
import * as React from "react";
import mixpanel from "@/utils/mixpanel";
import Image from "next/image";

export function activeSlot(slots: any) {
  for (let i = 0; i < slots?.length; i++) {
    if (slots[i].active === true) {
      return slots[i];
    }
  }
}

interface MasterclassCardProps extends MotionProps {
  masterclass: any;
  referer?: string | string[] | undefined;
  comment?: string | string[] | undefined;
}

export default function MasterclassCard({
  masterclass,
  referer,
  comment,
  ...props
}: MasterclassCardProps) {
  const rating = masterclass?.bootcamp?.teacher?.achievements?.split(";")[0]; //rating
  const students = masterclass?.bootcamp?.teacher?.achievements?.split(";")[2]; //students taught
  const starArray = [1, 2, 3, 4, 5];
  const router = useRouter();
  function onRegisterButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    router.push(
      `/masterclasses/${masterclass?.slug}?register=true${
        referer ? `&source=${referer}` : ""
      }${comment ? `&comment=${comment}` : ""}`
    );
  }

  return (
    <motion.div
      {...props}
      className="w-full self-stretch md:max-w-[340px] flex flex-col gap-2 justify-center items-start rounded-lg shadow-[0_0px_7.596px_0px_rgba(190,190,190,0.4)] p-5 max-xl:p-3 hover:cursor-pointer font-sans"
      onClick={() => {
        router.push(
          `/masterclasses/${masterclass?.slug}${
            referer ? `?source=${referer}` : ""
          }${comment ? `&comment=${comment}` : ""}`
        );
        mixpanel.track("register_now", {
          location: "card",
          masterclass: masterclass?.title,
        });
      }}
    >
      <div className="flex flex-col space-y-3 w-full">
        <Image
          src={masterclass?.bootcamp?.coverImage || "/fallback-thumbnail.webp"}
          width={300}
          height={168}
          alt="bootcamp thumbnail"
          className={cn(
            "rounded-md w-full",
            masterclass?.bootcamp?.coverImage &&
              "shadow-[0_0.9px_3.6px_0px_rgba(0,0,0,0.06)]"
          )}
          quality={50}
        />
        <div className="flex justify-between items-center w-full text-xs pb-2 border-b-2 border-[#ACACAC7A] border-dotted font-medium">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4 text-[#0A2133]" />
            <p className="text-[#606060]">
              {dayjs(activeSlot(masterclass?.slots)?.startDateTime)?.format(
                "DD MMMM"
              )}{" "}
              (
              {dayjs(activeSlot(masterclass?.slots)?.startDateTime)?.format(
                "dddd"
              )}
              )
            </p>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" color="#0A2133" />
            <p className="text-[#606060]">
              {dayjs(activeSlot(masterclass?.slots)?.startDateTime)?.format(
                "hh:mm A"
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-row justify-between items-center w-full max-xl:text-xs max-md:text-base font-medium">
          <div className="flex flex-row gap-1 flex-wrap">
            {masterclass?.categories?.length > 0 ? (
              masterclass?.categories?.map((category: any, index: number) => (
                <React.Fragment key={category?.id}>
                  <p className="text-xs text-[#606060] capitalize">
                    {category.name}
                  </p>
                  {masterclass?.categories?.length > 1 &&
                    index !== masterclass?.categories?.length - 1 && (
                      <p className="text-xs text-[#606060]"> | </p>
                    )}
                </React.Fragment>
              ))
            ) : (
              <p className="text-xs text-[#606060] capitalize">Finance</p>
            )}
          </div>
          <div className="flex flex-row justify-end gap-1 flex-wrap">
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
                      <StarIcon
                        key={index}
                        className="w-3 h-3 text-[#FFA135]"
                      />
                    );
                  })}
            </div>
            <p className="text-[#606060] text-xs">
              {rating && rating != "null" ? rating : 5} (
              {parseInt(students) > 1000
                ? `${Math.floor(parseInt(students) / 1000)}k+`
                : "10k+"}
              )
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 w-full h-full">
        <h4 className="font-semibold md:text-lg multiline-ellipsis">
          {masterclass?.title}
        </h4>
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-row gap-1.5 justify-start items-center relative">
            <h4 className="text-[#FF7426] font-semibold text-lg">Free </h4>
            <div className="flex flex-col justify-center text-[#606060] text-sm before:content-[url('/masterclass-card-strike-through.svg')] before:absolute before:left-11 before:bottom-1">
              ₹499
            </div>
          </div>
          <Button
            onClick={onRegisterButtonClick}
            size={"sm"}
            className="rounded font-bold font-inter px-6 py-1.5"
          >
            Register Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
