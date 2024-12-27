import React from "react";

export default function TransparentGradientBanner({
  bannerClass = "",
  bannerTextClass = "text-black",
  dateData = '{"startDate": "13\'th DEC","endDate":"15\'th DEC"}',
  bannerbkgClassName = "max-w-[250px] ",
  width = "429",
  height = "42",
  viewBox = "0 0 429 42",
  fill = "none",
  gradientId = "paint0_linear_257_746",
  gradientColors = [
    { offset: "0%", color: "#E5CA7D" },
    { offset: "100%", color: "#E5D388" }
  ],
  gradientCoordinates = { x1: "0.0672607", y1: "20.9324", x2: "428.189", y2: "20.9324" }
}: {
  bannerClass?: string;
  bannerTextClass?: string;
  dateData?: string;
  bannerbkgClassName?: string;
  width?: string;
  height?: string;
  viewBox?: string;
  fill?: string;
  gradientId?: string;
  gradientColors?: { offset: string; color: string }[];
  gradientCoordinates?: { x1: string; y1: string; x2: string; y2: string };
}) {
  const parsedDate = JSON.parse(dateData);

  return (
    <div className={`relative w-full flex justify-center items-center ${bannerClass} `}>
      <DateBannerBkg
        className={bannerbkgClassName}
        width={width}
        height={height}
        viewBox={viewBox}
        fill={fill}
        gradientId={gradientId}
        gradientColors={gradientColors}
        gradientCoordinates={gradientCoordinates}
      />
      <div className={`relative w-[300px] h-[40px]rounded-full flex items-center justify-center ${bannerClass}  `}>
        <div className={`${bannerTextClass} z-10  text-center font-bold`}>
          {parsedDate.startDate} to
          {' ' + parsedDate.endDate}
        </div>
      </div>

    </div>
  );
}

export function DateBannerBkg({
  className = "",
  width,
  height,
  viewBox,
  fill,
  gradientId,
  gradientColors,
  gradientCoordinates
}: {
  className?: string;
  width?: string;
  height?: string;
  viewBox?: string;
  fill?: string;
  gradientId: string;
  gradientColors: { offset: string; color: string }[];
  gradientCoordinates: { x1: string; y1: string; x2: string; y2: string };
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute  w-full ${className}`}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M428.121 0.353751C428.2 0.333012 428.257 0.261393 428.257 0.179524C428.257 0.0803755 428.176 0 428.077 0H1.07309C0.480438 0 0 0.480438 0 1.07309C0 1.51248 0.269279 1.90637 0.674098 2.07721C9.7622 5.91256 15.8522 12.9516 15.8522 21C15.8522 29.0633 9.73975 36.1134 0.623866 39.9439C0.249193 40.1014 0 40.4659 0 40.8723C0 41.4204 0.444369 41.8648 0.99253 41.8648H428.153C428.21 41.8648 428.257 41.8185 428.257 41.7615C428.257 41.7143 428.224 41.6731 428.179 41.6612C416.316 38.574 407.852 30.4885 407.852 21C407.852 11.5268 416.289 3.4521 428.121 0.353751Z"
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1={gradientCoordinates.x1}
          y1={gradientCoordinates.y1}
          x2={gradientCoordinates.x2}
          y2={gradientCoordinates.y2}
          gradientUnits="userSpaceOnUse"
        >
          {gradientColors.map((color, index) => (
            <stop
              key={index}
              offset={color.offset}
              stopColor={color.color}
            />
          ))}
        </linearGradient>
      </defs>
    </svg>
  );
}

