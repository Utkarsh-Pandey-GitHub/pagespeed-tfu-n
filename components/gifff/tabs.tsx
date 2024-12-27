import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Gifff from "./gifff";
import ReferAndEarn from "./refer";
import Redeem from "./redeem";
import { useEffect, useState } from "react";
import { DashboardData } from "@/pages/gifff/dashboard";
import mixpanel from "@/utils/mixpanel";
import { useRouter } from "next/router";
import Image from "next/image";

const tabs = [
  {
    icon: "🇮🇳",
    label: "#GIFFF",
    value: "dashboard",
    content: Gifff,
  },
  {
    icon: (
      <Image
        alt="refer"
        src="/tradewise/green-whatsapp.svg"
        width={24}
        height={24}
      />
    ),
    label: "Invite & Earn",
    value: "refer",
    content: ReferAndEarn,
  },
  {
    icon: <Image alt="paytm" src="/gifff/paytm.png" width={50} height={50} />,
    label: "Cash upto ₹10,000",
    value: "redeem",
    content: Redeem,
  },
];

export default function GifffTabs({
  dashboardData,
}: {
  dashboardData: DashboardData | null;
}) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter();

  useEffect(() => {
    const userDataAsJSON = JSON.parse(
      localStorage.getItem("tfu-user-auth") ?? "{}"
    );
    mixpanel.track(`${activeTab} page`, {
      source: localStorage.getItem("tw-referrer") ? "referral" : "direct",
      ...(userDataAsJSON?.name && {
        name: userDataAsJSON?.name,
        phone: userDataAsJSON?.phone,
      }),
    });
  }, [activeTab]);

  useEffect(() => {
    const { page } = router.query;
    if (page) {
      setActiveTab(page as string);
    }

    const tabContentDiv = document.querySelectorAll("section");
    tabContentDiv.forEach((div) => {
      div.scrollTo({ top: 0 });
    });
  }, [router.query]);

  if (!router.isReady) {
    return null;
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        setActiveTab(value);
        router.push(`/gifff/dashboard?page=${value}`);
      }}
    >
      <TabsList className="grid z-40 sticky top-[4.3rem] grid-cols-3 grid-rows-1 gap-1 p-2 h-16 bg-white rounded-none">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="border-0 border-b-[3px] border-black/20 data-[state=active]:bg-gradient-to-r from-orange-400/10 to-green-400/10 data-[state=active]:border-black flex items-center h-full gap-0.5"
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className="text-sm text-balance">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="h-14" />
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {
            <tab.content
              className="pb-16"
              switchTab={(val: string) => {
                router.push(`/gifff/dashboard?page=${val}`);
              }}
              dashboardData={dashboardData}
            />
          }
        </TabsContent>
      ))}
    </Tabs>
  );
}
