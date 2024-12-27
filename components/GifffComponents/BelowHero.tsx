import React from "react";
import Image from "next/image";

export default function GiffDesc({
  handleLeadModalOpen,
  pageType = "paid",
}: {
  handleLeadModalOpen: () => void;
  pageType?: string;
}) {
  const content = [
    "Master Intraday & Positional Trading",
    "Unlock Forex Trading",
    "Trade Institutional Trading Strategies",
    "Live Trade with Top Experts",
    "Dive into Commodities Market",
    "Excel with Order Flow Analysis",
  ];
  return (
    <div className="flex flex-col items-center justify-center md:p-4 md:mt-10 mt-4 w-full  md:bg-blue-50 overflow-hidden">
      <div className="flex justify-center w-full">
        <div className="max-w-4xl w-full flex flex-col items-center justify-center md:py-7">
          <h2 className="text-xl md:text-4xl w-full text-center my-2 md:font-bold md:leading-relaxed mb-4 ">
            In 5 Days You Will
          </h2>
          <div className=" w-full px-4  md:w-4/5 ml-2 grid grid-col-1 md:grid-cols-2 grid-row-2 gap-2">
            {content.map((text, ind) => (
              <div
                className="max-md:px-4 max-md:py-2 p-2 md:px-4 bg-[#000080] bg-opacity-5 font-semibold flex w-full justify-start gap-2 items-center rounded-md md:text-[18px]"
                key={ind}
              >
                <Image
                  src="/gifff/frame.png"
                  width={24}
                  height={30}
                  alt="orange checkbox"
                />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleLeadModalOpen}
        className="md:w-3/5 bg-[#000080] !text-white py-3 text-lg font-semibold mt-4  relative"
      >
        <div className="absolute inset-0 bg-[linear-gradient(110deg,#00000000,45%,#ffffff80,55%,#00000000)] bg-[length:200%_100%] animate-shimmer rounded-md" />
        {pageType === "paid" ? (
          <>
            Claim Your VIP Pass at{" "}
            <div className="relative ml-2 mr-2">
              ₹1000{" "}
              <div className="w-14 h-1 bg-red-500 absolute -rotate-12 top-3" />
            </div>{" "}
            ₹99
          </>
        ) : (
          "Claim Your Free VIP Pass"
        )}
      </button>
    </div>
  );
}
