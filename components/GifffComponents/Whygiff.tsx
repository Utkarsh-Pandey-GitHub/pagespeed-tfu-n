import React from 'react'


export default function WhatIsGifff({ handleLeadModalOpen, pageType = "paid" }: { handleLeadModalOpen: () => void, pageType?: string }) {
    return <section className="mx-auto md:p-4 mt-10 flex flex-col items-center">
        <div className=" flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-center mb-2">What are the <br /> Big Learning Days?</h1>
            <div className="w-28 h-1 bg-[#A62C2E] mb-6" />
        </div>
        <div className="px-6 flex flex-wrap rounded-lg w-full items-center justify-center ">
            <div className="border flex md:p-4  p-2 gap-4 bg-blue-200 bg-opacity-10 items-center  max-w-lg border-[#800000] border-opacity-40 max-md:rounded-t-lg ">
                <ArrowIcon className="w-6 h-6" />
                <p>India has been a free country for 77 years. But do you think you are <b>financially free?</b> No, right?</p>
            </div>
            <div className="border flex md:p-4  p-2 gap-4 bg-blue-200 bg-opacity-10 items-center max-w-lg border-[#800000] border-opacity-40">
                <ArrowIcon className="w-6 h-6" />
                <p>Join the <b>Big Learning Days</b> to connect with India&apos;s top experts and create your 1 crore trading plan.</p>
            </div>
            <div className="border flex md:p-4  p-2 gap-4 bg-blue-200 bg-opacity-10 items-center max-w-lg border-[#800000] border-opacity-40">
                <ArrowIcon className="w-6 h-6" />
                <p>Attend Live Sessions, Workshops, and Live market sessions to start your profitable trading journey.</p>
            </div>
            <div className="border flex md:p-4  p-2 gap-4 bg-blue-200 bg-opacity-10 items-center max-w-lg  border-[#800000] border-opacity-40 max-md:rounded-b-lg">
                <ArrowIcon className="w-4 h-4" />
                <p>This <b>3 day event</b> is your final stop on becoming a Profitable Trader!</p>
            </div>
        </div>
        <button
            onClick={handleLeadModalOpen}
            className="md:w-1/2 bg-[#A62C2E] !text-[#ffffff]  py-3 text-lg font-semibold mt-6 md:mt-10 hover:scale-105 relative"
        >
            <div className="absolute inset-0 bg-[linear-gradient(110deg,#00000000,45%,#ffffff80,55%,#00000000)] bg-[length:200%_100%] animate-shimmer rounded-md" />
            {pageType === "paid" ? <>Claim Your VIP Pass at <div className="relative ml-2 mr-2">₹1000 <div className="w-14 h-1 bg-red-500 absolute -rotate-12 top-3" /></div> ₹99</> : "Claim Your Free VIP Pass"}
        </button>
    </section>
}

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
    return <>
        <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 25" fill="none">
            <g clipPath="url(#clip0_20_264)">
                <path d="M12 1.04907C18.4219 1.04907 23.625 6.2522 23.625 12.6741C23.625 19.0959 18.4219 24.2991 12 24.2991C5.57812 24.2991 0.375 19.0959 0.375 12.6741C0.375 6.2522 5.57812 1.04907 12 1.04907ZM6.5625 14.7366H12V18.06C12 18.5616 12.6094 18.8147 12.9609 18.4584L18.3187 13.0725C18.5391 12.8522 18.5391 12.5006 18.3187 12.2803L12.9609 6.8897C12.6047 6.53345 12 6.78657 12 7.28814V10.6116H6.5625C6.25313 10.6116 6 10.8647 6 11.1741V14.1741C6 14.4834 6.25313 14.7366 6.5625 14.7366Z" fill="#040404" />
            </g>
            <defs>
                <clipPath id="clip0_20_264">
                    <rect width="24" height="24" fill="white" transform="translate(0 0.674072)" />
                </clipPath>
            </defs>
        </svg>
    </>
}

