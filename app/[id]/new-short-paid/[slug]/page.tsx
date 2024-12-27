"use client";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Script from "next/script";
import { use, useEffect, useState } from "react";
import { NextPageContext } from "next";
import mixpanel from "@/utils/mixpanel";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import DATA from "./short_paid_content.json";
import { Clock, Calendar } from "lucide-react";
import getOffers from "@/marketingUtils/bumpDataFunct";
import { formatDate, formatTime } from "@/marketingUtils/dateTimeParser";
import { schema } from "@/types/marketingTypes/ShortPaidJsonDT";
import LeadShortPaidForm from "@/components/MarketingComponents/LeadShortPaidForm";
import { fetchMasterClass } from "@/app/actions";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params.slug as string) || "default";
  const id = (params.id as string) || "default";
  const [masterclassData, setMasterclassData] = useState<any>({});
  const [abTestCounter, setAbTestCounter] = useState<any>(0);
  const [fullDomain, setFullDomain] = useState<any>(0);
  const testType = "paid-normal-bump";
  const pageData = (DATA as schema)[slug];
  useEffect(() => {
    if (typeof window !== "undefined") {
      const protocol = window.location.protocol;
      const host = window.location.host;
      setFullDomain(`${protocol}//${host}`);
    }
    fetchMasterClass(id, testType)
      .then((data: any) => {
        setAbTestCounter(data.abTestCounter);
        setMasterclassData(data.masterclassData);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        console.log(masterclassData);
      });
  }, []);
  const activeSlot = masterclassData?.slots?.find(
    (slot: any) => slot.active === true
  );
  const activeTime = formatTime(activeSlot?.startDateTime);
  const activeDate = formatDate(activeSlot?.startDateTime);
  const source = ((searchParams as any).source as string) || "direct";
  const backComment =
    (source as string).toLowerCase() === "google"
      ? "paidMasterClass"
      : "paidBootcamp";
  const leadComment = ((searchParams as any).comment as string) || "";

  const amount = pageData?.amount || source === "google" ? 49 : 99;
  const path = usePathname();

  const bucket =
    abTestCounter % 10 == 1 || abTestCounter % 10 == 2 ? "Exp" : "Control";

  useEffect(() => {
    mixpanel.track("marketing_page", {
      page_location: window.location.href,
      page_referrer: document.referrer,
      masterclass: masterclassData?.title,
      type: "paid",
      landing_page: "new-short-paid",
      masterclassId: id,
      platform: "tradewise",
    });
    mixpanel.track("marketing_ab_test", {
      platform: "tradewise",
      masterclassId: id,
      landing_page: "new-short-paid",
      abtesttype: "paid-normal-bump",
      bucket: `${bucket}`,
    });
  }, []);

  return (
    <>
      <Head>
        <title>{pageData.page_title}</title>
        <meta
          name={pageData.meta.name}
          content={pageData.meta.content}
          key={pageData.meta.content}
        />
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
           (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5G6WR26B');
        `,
          }}
        />
      </Head>
      <main className="flex flex-col items-center w-full h-screen ">
        <Image
          src="/logo.svg"
          alt="logo"
          width={100}
          height={100}
          className="absolute top-14 left-20 max-md:hidden"
        />
        <h1 className="text-3xl md:text-5xl font-bold text-center mt-8 md:mt-24 text-[#00b75a] uppercase font-montserrat max-w-4xl">
          {pageData.heading}
        </h1>
        <h3 className="text-base md:text-xl text-center mt-4 font-semibold">
          {pageData.sub_heading}
        </h3>
        <section className="container flex flex-col md:flex-row md:gap-4 gap-0 md:mt-10 md:px-12 mt-5">
          <div className="bg-[url('/BK-Harmonic.webp')]  bg-cover bg-no-repeat  flex flex-col gap-2 md:w-1/2 items-center justify-center relative w-full">
            <Image
              src={`/${slug}/teacher-photo.webp`}
              height={250}
              width={250}
              alt={slug}
              priority
            />
            <div className="bg-white p-4 w-5/6 shadow-lg text-center rounded-lg">
              <h1 className="text-2xl font-bold text-[#00b75a] ">
                {pageData.teacher_name}
              </h1>
              <div className="text-base">{pageData.teacher_exp}</div>
            </div>
            <div className="flex justify-between md:w-5/6 w-full">
              <div className="flex bg-green-100 p-2 gap-3 rounded-xl px-6">
                <div className="p-2 bg-green-500 rounded-lg grid place-items-center">
                  <Calendar size={25} className="text-white" />
                </div>
                <div>
                  <p className="text-sm">Date</p>
                  <p className=" font-bold">{activeDate}</p>
                </div>
              </div>
              <div className="flex bg-green-100 p-2 gap-3 rounded-xl px-6">
                <div className="p-2 bg-green-500 rounded-lg grid place-items-center">
                  <Clock size={25} className="text-white" />
                </div>
                <div>
                  <p className="text-sm">Time</p>
                  <p className="font-bold">{activeTime}</p>
                </div>
              </div>
            </div>
          </div>
          <LeadShortPaidForm
            className="m-2 md:p-4"
            masterClass={masterclassData}
            buttonStyle="![background:linear-gradient(98.05deg,#4E9F3D_0%,#AFC570_100%)] md:mt-3 mt-1 btn-block hover:scale-105  p-3 text-white font-semibold text-xl"
            inputStyle="md:!py-3 !py-3 px-3"
            amount={pageData.amount || amount}
            backComment={backComment}
            source={source as string}
            leadComment={leadComment as string}
            customToken={pageData.custom_token}
            fullDomain={fullDomain}
            masterClassId={id}
            abTestCounter={abTestCounter}
            isBumpOffer={bucket == "Exp" ? true : false}
            bumpOfferArray={getOffers(slug)}
            abTestType={testType}
            pageDesc={path ? path : fullDomain}
          />
        </section>
      </main>
    </>
  );
}
