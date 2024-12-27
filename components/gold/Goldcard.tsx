import * as React from "react";
import GoldBenefits from "./GoldBenefits";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { ChevronRight, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/utils/cn";
import mixpanel from "@/utils/mixpanel";

export default function GoldCard({
  price,
  addPlan,
  setPrice,
  setAddPlan,
  bootcamp,
}: {
  price: any;
  addPlan: boolean;
  setPrice: React.Dispatch<any>;
  setAddPlan: React.Dispatch<boolean>;
  bootcamp?: any;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <GoldBenefits closeDrawer={closeDrawer} open={isDrawerOpen} />
      <Card
        onClick={() => {
          if (!addPlan) {
            setAddPlan(true);
            setPrice(price + 999);
            mixpanel.track(addPlan ? "add_gold" : "remove_gold", {
              bootcamp: bootcamp?.Bootcamp?.title,
            });
          }
        }}
        className={cn(
          "flex cursor-pointer relative flex-row justify-between items-center rounded-xl border-2 border-orange-300",
          addPlan ? "bg-gradient-to-br from-yellow-50 to-orange-50" : ""
        )}
      >
        <Button
          type="button"
          variant="outline"
          size={"sm"}
          onClick={(e) => {
            e.stopPropagation();
            if (addPlan) {
              setPrice(price - 999);
            } else {
              setPrice(price + 999);
            }
            setAddPlan(!addPlan);
          }}
          className={cn(
            "absolute focus:text-white bg-yellow-700 hover:bg-yellow-500 text-white border-0 rounded-lg top-0 right-0 -translate-y-1/2 p-0 h-6 aspect-square",
            addPlan ? "rounded-full" : "px-2"
          )}
        >
          <Plus className={cn("w-4 h-4", addPlan && "rotate-45")} />
          {!addPlan && <span className="mr-1">Add</span>}
        </Button>
        <CardHeader className="p-3 flex-row gap-1 space-y-0">
          <Image
            src="/tradewise/star.svg"
            alt="TradeWise Star"
            width={40}
            height={40}
          />
          <div>
            <CardTitle className="flex font-medium items-center gap-1 text-lg md:text-xl">
              <span>TradeWise</span>
              <Image
                src="/tradewise/gold.svg"
                alt="TradeWise Gold"
                width={60}
                height={60}
              />
            </CardTitle>
            <CardDescription>
              <Button
                type="button"
                variant={"link"}
                onClick={(e) => {
                  e.stopPropagation();
                  openDrawer();
                }}
                className="p-0 bg-transparent h-auto"
              >
                View all benefits
                <ChevronRight className="w-4 h-4 inline ml-1" size={16} />
              </Button>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-3 justify-between h-full">
          <span className="flex items-end gap-x-2">
            <p className="text-lg md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#9A7026] via-[#D8AB65] to-[#9A7026] font-semibold text-right">
              ₹999
            </p>
            <p className="text-md font-semibold text-right line-through">
              ₹28,000
            </p>
          </span>
          <p className="text-xs font-semibold text-right">
            3 months plan {addPlan && "added"}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
