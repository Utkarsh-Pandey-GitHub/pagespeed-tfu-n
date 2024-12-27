import axios from "axios";
import { NextPageContext } from "next";
import { useEffect } from "react";
import Head from "next/head";
import mixpanel from "@/utils/mixpanel"



const Redirect = () => {
  
  
  
  return (
    <>
      <Head>
        <title>Thanks For Registering </title>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5G6WR26B');`,
          }}
        />
      </Head>

      <main className="h-screen w-screen bg-slate-100">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5G6WR26B"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <div className="pt-48 w-full flex items-center justify-center flex-col gap-4 px-10">

          { <h1 className="md:text-3xl tracking-tight font-mono text-xl text-center">
            Thanks For Registering For the{" "}
            <b className="text-green-500">MasterClass</b>
          </h1>}

          <h2 className="text-base md:text-2xl text-center mt-4">
            Click The Button Below And Join The WhatsApp Group
          </h2>
          <button
            className="bg-green-500 py-4 px-8 text-black cursor-pointer hover:scale-110"
          >
            Join WhatsApp Group
          </button>
        </div>
      </main>
    </>
  );
};

export default Redirect;

