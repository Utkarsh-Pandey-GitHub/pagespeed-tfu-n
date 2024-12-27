import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { ClockIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { MotionProps, motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/24/solid";
import mixpanel from "@/utils/mixpanel";

interface TeacherCardProps extends MotionProps {
  data: any;
}

const TeacherCard = ({ data, ...props }: TeacherCardProps) => {
  const router = useRouter();

  const masterClasses = data.bootcamp.map((bx: any) => bx.masterClass).flat(1);
  const slots = masterClasses.map((mc: any) => mc.slots).flat(1);
  const categories = masterClasses.map((mc: any) => mc.categories).flat(1);
  const subCategories = categories.filter((c: any) => c.parentId);
  const upComingMasterclass = masterClasses.find(
    (mc: any) => mc.id === slots?.[0]?.masterClassId
  );

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    router.push(`/masterclasses/${upComingMasterclass?.slug}?register=true`);

    mixpanel.track("view_details", {
      page_location: "Our Experts",
      location: "Card CTA",
      masterclass: upComingMasterclass?.slug,
    });
  };

  const onCardClick = () => {
    router.push(`/masterclasses/${upComingMasterclass?.slug}`);

    mixpanel.track("view_details", {
      page_location: "Our Experts",
      location: "Card",
      masterclass: upComingMasterclass?.slug,
    });
  };

  return (
    <motion.div
      {...props}
      onClick={onCardClick}
      className="cursor-pointer flex flex-col justify-between w-full md:max-w-[340px] h-full shadow-[0px_0px_6.23px_0px_rgba(99,99,99,0.20)] p-4 bg-white rounded-lg"
    >
      <div className="flex gap-2 pb-2 border-b-2 border-[#ACACAC7A] border-dotted">
        <Image
          src={data?.photo && data?.photo !== "undefined" ? data?.photo : ""}
          width={90}
          height={90}
          alt="teacher img"
          className="object-cover object-center rounded-lg h-[90px] w-[90px] bg-[#FFE6D1]"
        />

        <div className="ml-2 flex-1">
          <div className="w-full flex justify-between">
            <div className="font-semibold leading-tight text-pretty">
              {data?.name}
            </div>
            <div className="flex text-[11.5px] gap-1 items-center h-fit">
              <div className="flex flex-row justify-center items-center">
                <StarIcon className="w-[14px] h-[14px] text-[#FFA135]" />
                <StarIcon className="w-[14px] h-[14px] text-[#FFA135]" />
                <StarIcon className="w-[14px] h-[14px] text-[#FFA135]" />
                <StarIcon className="w-[14px] h-[14px] text-[#FFA135]" />
                <StarIcon className="w-[14px] h-[14px] text-[#F9D4AB]" />
              </div>
              4.5
            </div>
          </div>
          <div className="text-sm font-medium mt-2 text-black">
            Expert in:{" "}
            {router.query.category &&
            typeof router.query.category === "string" ? (
              <span className="text-[#606060] capitalize">
                {router.query.category.replace("_", " ")}
              </span>
            ) : (
              <span className="text-[#606060] capitalize">
                {subCategories.length > 0 ? subCategories[0]?.name : "Finance"}
              </span>
            )}
          </div>
          <div className="flex text-xs items-center font-semibold mt-2 text-[#525252]">
            <Image
              src="/green-verified.svg"
              width={15}
              height={15}
              alt="verified icon"
            />
            Verified expert
          </div>
        </div>
      </div>

      <div className="flex justify-between text-xs lg:text-[11px] font-medium mt-2">
        Upcoming Class:
        <div className="text-[#606060] flex gap-[5.7px] lg:gap-0.5 items-center">
          <Image
            src="/calender-icon.svg"
            width={18}
            height={18}
            alt="calender-icon"
          />
          {dayjs(upComingMasterclass?.slots?.[0]?.startDateTime).format(
            "DD MMMM (dddd)"
          )}
        </div>
        <div className="text-[#606060] flex gap-[5.7px] items-center">
          <ClockIcon className="w-4 h-4" color="#0A2133" />
          {dayjs(upComingMasterclass?.slots?.[0]?.startDateTime).format(
            "hh:mm A"
          )}
        </div>
      </div>

      <Button onClick={onClick} className="w-full mt-3 font-bold self-end">
        Register Now
      </Button>
    </motion.div>
  );
};

export default TeacherCard;
