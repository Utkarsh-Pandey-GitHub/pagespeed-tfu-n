import { StarIcon } from "@heroicons/react/24/solid";

export default function ReviewCard({
  name,
  message,
  profession,
  time,
  rating,
}: {
  name: string;
  message: string;
  profession: string;
  time: number;
  rating: number;
}) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex flex-col justify-center items-start w-full gap-2 md:border-t-2 md:pt-5">
      {/* mobile view */}
      <div className="flex flex-row justify-between items-center w-full md:hidden">
        <div className="flex flex-row justify-start items-center gap-2">
          <div className="w-9 h-9 flex justify-center items-center bg-[#b0ccf5] text-blue-950 font-semibold rounded-full">
            {name?.substring(0, 1).toUpperCase()}
          </div>
          <div className="flex flex-col justify-start items-start">
            <p className="font-semibold">{name}</p>
            <small>{profession}</small>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start">
          <div className="flex flex-row justify-center items-center gap-1">
            <small className="text-[#606060]">{rating}</small>
            <div className="flex flex-row justify-center items-center">
              {stars.map((star: number) => {
                if (star <= Math.ceil(rating)) {
                  return (
                    <StarIcon className="w-5 h-5 text-[#FFA135]" key={star} />
                  );
                } else {
                  return (
                    <StarIcon className="w-5 h-5 text-[#F9D4AB]" key={star} />
                  );
                }
              })}
            </div>
          </div>
          <small className="text-[#323232]">{time} days ago</small>
        </div>
      </div>

      {/* website view */}
      <div className="flex flex-row items-center justify-start gap-2 max-md:hidden">
        <div className="w-9 h-9 flex justify-center items-center bg-[#b0ccf5] text-blue-950 font-semibold rounded-full">
          {name?.substring(0, 1).toUpperCase()}
        </div>
        <div className="flex flex-col justify-start items-start">
          <div className="flex flex-row justify-start items-center gap-1">
            <p className="font-semibold text-[#1D2026]">{name}</p>
            <small className="text-[#6E7485]">• {time} days ago</small>
          </div>

          <div className="flex flex-row justify-center items-center">
            {stars.map((star: number) => {
              if (star <= Math.ceil(rating)) {
                return (
                  <StarIcon className="w-4 h-4 text-[#FFA135]" key={star} />
                );
              } else {
                return (
                  <StarIcon className="w-4 h-4 text-[#F9D4AB]" key={star} />
                );
              }
            })}
          </div>
        </div>
      </div>
      <p className="md:ml-11 text-[#4E5566] md:text-[14px]">{message}</p>
    </div>
  );
}
