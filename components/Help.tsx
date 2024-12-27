import { useRouter } from "next/router";
import BootcampForm from "./Bootcamp/Bootcampform";
import NewLeadForm from "./Masterclass/New-lead-form";
import { useEffect, useRef } from "react";
import { CLASS_TYPE } from "@/pages/bootcamps";
import Link from "next/link";
import webengage from "@/webengage";
import Image from "next/image";

export default function Help({
  data,
  scroll,
  price,
  setPrice,
  setScroll,
  type,
  offerEndTime,
  addPlan,
  setAddPlan,
}: {
  data: any;
  scroll?: boolean;
  price?: any;
  setPrice?: React.Dispatch<any>;
  setScroll?: React.Dispatch<any>;
  type: any;
  offerEndTime: any;
  addPlan?: boolean;
  setAddPlan?: React.Dispatch<boolean>;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scroll === true && setScroll) {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        setScroll(false);
      }, 100);
    }
  }, [scroll]);

  return (
    <div className="py-3 flex flex-col gap-4 justify-start items-start w-full">
      <h4 className="text-[#002082] font-semibold md:hidden">
        For more details about the course
      </h4>
      <p className="text-[#161C2B]">
        If you have any question regarding the course and couldn't find the
        answer on this page, feel free to contact us
      </p>
      <h4 className="text-[#002082] font-semibold md:text-[#1D2026]">
        Message us on Whatsapp
      </h4>
      <div className="flex flex-row justify-start items-center gap-2 w-full">
        <Image
          height={40}
          width={40}
          src="/tradewise/green-whatsapp.svg"
          alt="whatsapp icon"
        />
        <div className="flex flex-col justify-start items-start gap-0">
          <Link
            href={"https://wa.me/9056187997"}
            className="font-semibold text-black"
            onClick={() => {
              const _webengage = webengage();
              if (_webengage) {
                _webengage.track("Contact Us", {
                  source: "Tradewise",
                  type: "Chat",
                });
              }
            }}
          >
            9056187997
          </Link>
          <p className="text-[#161C2B]">Working Hours (10 AM - 10 PM)</p>
        </div>
      </div>

      <div ref={formRef} className="w-full md:hidden">
        <NewLeadForm offerEndTime={offerEndTime} data={data} scroll={scroll!} />
      </div>
    </div>
  );
}
