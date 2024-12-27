import Image from "next/image";
import { useRouter } from "next/router";
import DateBanner from "../MarketingComponents/DateBanner";
import { useEffect, useRef } from "react";

const content = [
  "Master Intraday & Positional Trading",
  "Unlock Forex Trading",
  "Trade Institutional Trading Strategies",
  "Live Trade with Top Experts",
  "Dive into Commodities Market",
  "Excel with Order Flow Analysis",
];

export type logoType = {
  url: string;
  width: number;
  height: number;
  alt: string;
  classes?: string;
};

export default function HeroSection({
  handleLeadModalOpen,
  pageType = "paid",
  desktopViewImage = "/marketing/bld/bcg.webp",
  phoneViewImage = "/marketing/bld/bcgMobile.webp",
  heading1,
  heading2,
  teachersHeroImage = "/gifff/herophoto.png",
  dateData,
  logo = {
    url: "/marketing/bld/bldLogo.png",
    width: 200,
    height: 200,
    alt: "bld logo",
    classes: "mt-1",
  },
  dateBannerClass = "",
  dateBannerTextClass = "",
  bkgVideoUrlWebm,
    bkgVideoUrlMp4,
}: {
  handleLeadModalOpen: () => void;
  pageType?: string;
  desktopViewImage?: string;
  phoneViewImage?: string;
  heading1?: string;
  heading2?: string;
  teachersHeroImage?: string;
  dateData?: any;
  logo?: logoType;
  dateBannerClass?: string;
  dateBannerTextClass?: string;
  bkgVideoUrlWebm?: string;
  bkgVideoUrlMp4?: string;
}) {
  const videoRef = useRef();
  const router = useRouter();
  const isBld =
    router.pathname.includes("bld") || router.pathname.includes("bld-free");
  useEffect(()=>{
    const vd = document.getElementById("video-bkg") as HTMLVideoElement;
    if (vd) {
      vd.playbackRate = 0.65;
    }
  },[])
  const isNYTW = router.pathname.includes("nytw") ||  router.pathname.includes("nytw-free")
  return (
    <div className={`w-full bg-blend-screen hero-section bg-top sm:bg-center sm:bg-cover ${isNYTW?"!bg-black max-sm:!bg-opacity-60 sm:!bg-opacity-20":""}`}>
     <style jsx>{`
        .hero-section {
          background-image: url("${!bkgVideoUrlWebm?phoneViewImage:""}");
          background-position: top;
        }
        @media (min-width: 640px) {
          .hero-section {
            background-image: url("${!bkgVideoUrlWebm?desktopViewImage:""}");
            background-position: center;
          }
        }
      `}</style>
        {bkgVideoUrlWebm?<video
          className="absolute top-0 left-0  h-full  z-[-1] max-w-screen w-full  object-cover"
          autoPlay
          loop
          muted
          playsInline
          id="video-bkg"
        >
          <source src={bkgVideoUrlWebm} type="video/webm" />
          <source src={bkgVideoUrlMp4} type="video/mp4" />
          Your browser does not support the video tag.
        </video>:null}
      <div className="container flex flex-col items-center relative overflow-clip">
        <Image
          src={logo.url}
          height={logo.height}
          width={logo.width}
          alt={logo.alt}
          className={logo.classes}
        />
        <DateBanner
          bannerClass={dateBannerClass}
          bannerTextClass={dateBannerTextClass}
          dateData={dateData}
          gradientColors={[
            { offset: "0%", color: "#FFFFFF" },
            { offset: "100%", color: "#FFFFFF" },
          ]}
        />

        
        {heading1 && (
          <div className="text-[#ffffff] text-center text-lg mt-1  font-bold" dangerouslySetInnerHTML={{ __html: heading1 }} />
        )}
        {heading2 && (
          <div className="text-[#ffffff] text-center  text-sm mt-1  font-bold" dangerouslySetInnerHTML={{ __html: heading2 }} />
        )}

        <Image
          src={teachersHeroImage}
          className={`w-[700px] max-lg:w-[600px] max-sm:w-screen max-sm:scale-[1.15] ${
             "mt-10"
          } md:mt-5`}
          alt="all teachers combined"
          height={500}
          width={700}
          loading="eager"
        />
        <div className="h-44" />
      </div>
    </div>
  );
}
