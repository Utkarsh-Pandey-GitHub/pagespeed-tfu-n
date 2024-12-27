import React from "react";

export default function TeacherInfo({
  name,
  image,
  studentCount,
  experience,
  studentRating,
  imgClassName,
}: {
  name: string;
  image: string;
  studentCount?: string;
  experience?: string;
  studentRating?: string;
  imgClassName?: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center w-[600px] max-md:w-[320px] gap-3 max-xl:max-w-md">
      <div className="flex flex-row gap-2 justify-center items-center">
        <img
          src={image}
          alt="Teacher Image"
          className={`w-[160px] max-sm:w-32 ${imgClassName}`}
        />
        <div className="flex flex-col gap-3 md:flex-wrap mt-4">
          <p className="max-xl:text-xs">I will be your coach for 2+ Hrs</p>
          <h3 className="text-[#00B75A] font-extrabold max-xl:text-xl">
            {name}
          </h3>
          <p className="max-xl:text-xs">India's verified trader and teacher</p>
          <div className="border-2 border-gray-200 w-[80px] "></div>
          <p className="text-base max-xl:text-xs">
            I've taught over{" "}
            <b className="text-[#00B75A]">
              {studentCount ? studentCount : "10,000"}
            </b>{" "}
            students and amassed <b className="text-[#00B75A]">{experience}</b>{" "}
            of trading experience.
          </p>
        </div>
      </div>
      <div
        className="flex flex-row justify-center items-center p-4 max-md:p-2 gap-4 w-full h-16 max-md:w-[350px] max-xl:h-auto shadow-[4px_4px_15px_-2px_rgba(0,0,0,0.2)]
 rounded-lg"
      >
        <img
          src="/paid-mc/svg/stars.svg"
          className="flex flex-col justify-center"
        ></img>
        <p className="">
          <b className="font-semibold max-xl:text-sm">{studentRating}</b> People
          Rated My Programs with{" "}
          <b className="font-semibold max-xl:text-sm">4.9</b> Star
        </p>
      </div>
    </div>
  );
}
