import { BootcampSlugData } from "@/types/bootcamp-slug";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpenIcon,
  Grid2X2,
  HelpCircleIcon,
  LibraryBigIcon,
  MessageSquareIcon,
} from "lucide-react";
import Overview from "./Overview";
import Instructor from "./Instructor";
import Curriculum from "./Curriculum";
import Help from "./Help";
import Reviews from "./Reviews";
import { useEffect, useState } from "react";
import mixpanel from "@/utils/mixpanel";

export default function BootcampTabs({
  bootcamp,
}: {
  bootcamp: BootcampSlugData["data"];
}) {
  const tabsData = {
    overview: {
      title: "Overview",
      icon: Grid2X2,
      content: <Overview bootcamp={bootcamp} />,
    },
    instructor: {
      title: "Instructor",
      icon: LibraryBigIcon,
      content: <Instructor teacher={bootcamp.Bootcamp.teacher} />,
    },
    curriculum: {
      title: "Curriculum",
      icon: BookOpenIcon,
      content: <Curriculum Modules={bootcamp.Modules} />,
    },
    help: {
      title: "Help",
      icon: HelpCircleIcon,
      content: <Help />,
    },
    reviews: {
      title: "Reviews",
      icon: MessageSquareIcon,
      content: <Reviews slug={bootcamp.Bootcamp.slug} />,
    },
  };

  const [activeTab, setActiveTab] = useState<string>("Overview");

  useEffect(() => {
    if (!activeTab) return;
    mixpanel.track("bootcamp", {
      website: bootcamp?.Bootcamp?.title,
      tab: activeTab,
    });
  }, [activeTab]);

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="w-full sticky top-0 z-20 justify-start overflow-x-auto overflow-y-hidden h-16 bg-white">
        {Object.keys(tabsData).map((tab) => {
          const Icon = tabsData[tab as keyof typeof tabsData]?.icon;
          return (
            <TabsTrigger
              key={tab}
              className="w-full h-12 my-2 md:min-w-36 border-0 border-b-4 border-gray-100 data-[state=active]:border-blue-900 data-[state=active]:text-blue-900 data-[state=active]:fill-blue-900 data-[state=active]:font-semibold"
              value={tab}
              onClick={() =>
                setActiveTab(tabsData[tab as keyof typeof tabsData]?.title)
              }
            >
              <Icon className="w-6 h-6 fill-inherit text-white max-md:hidden mr-2" />
              {tabsData[tab as keyof typeof tabsData]?.title}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {Object.keys(tabsData).map((tab) => (
        <TabsContent key={tab} value={tab} className="pb-8 pt-4">
          {tabsData[tab as keyof typeof tabsData]?.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
