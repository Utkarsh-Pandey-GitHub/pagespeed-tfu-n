import { BootcampSlugData } from "@/types/bootcamp-slug";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";

const Summary = ({
  isToken,
  isDiscounted,
  tokenAmount,
  price,
  addPlan,
  bootcamp,
  couponDiscount,
}: {
  price: number;
  isToken: boolean;
  isDiscounted: boolean;
  addPlan: boolean;
  tokenAmount?: number;
  bootcamp: BootcampSlugData["data"];
  couponDiscount?: number;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const isTokenApplied = isToken && tokenAmount;
  const isDiscountedApplied = isDiscounted && price;
  return (
    <Collapsible className="space-y-2" open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="border-none p-0 text-blue-900">
        Summary{" "}
        <ChevronRight className={cn("h-4 w-4", isOpen ? "rotate-90" : "")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <p>Actual Price</p>
          <p className="font-semibold">
            {Number(bootcamp.Bootcamp.price).toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            })}
          </p>
        </div>
        {addPlan && (
          <div className="flex justify-between">
            <p>Tradewise Gold</p>
            <p className="font-semibold">
              {Number(999).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 0,
              })}
            </p>
          </div>
        )}
        <div className="flex justify-between">
          <p>Offer Discount</p>
          <p className="font-semibold">
            -{" "}
            {Number(
              bootcamp.Bootcamp.price - bootcamp.Bootcamp.discountedPrice
            ).toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            })}
          </p>
        </div>
        {isDiscountedApplied ? (
          <div className="flex justify-between">
            <p>Extra Discount</p>
            <p className="font-semibold">
              -{" "}
              {Number(bootcamp.Bootcamp.discountedPrice - price).toLocaleString(
                "en-IN",
                {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 0,
                }
              )}
            </p>
          </div>
        ) : null}
        {couponDiscount ? (
          <div className="flex justify-between">
            <p>Coupon Discount</p>
            <p className="font-semibold">
              -{" "}
              {Number(couponDiscount).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 0,
              })}
            </p>
          </div>
        ) : null}
        <hr />
      </CollapsibleContent>
      <div className="flex justify-between text-sm">
        <p>Savings</p>
        <p className="font-semibold">
          {Number(
            bootcamp.Bootcamp.price -
              bootcamp.Bootcamp.discountedPrice +
              (couponDiscount! ? couponDiscount : 0) +
              (isDiscountedApplied
                ? bootcamp.Bootcamp.discountedPrice - price
                : 0)
          ).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
          })}
        </p>
      </div>
      <hr />
      <div className="flex justify-between text-green-600 text-sm">
        <p>Final Price</p>
        <p className="font-semibold">
          {Number(
            isDiscountedApplied
              ? price -
                  (couponDiscount ? couponDiscount : 0) +
                  (addPlan ? 999 : 0)
              : bootcamp.Bootcamp.discountedPrice -
                  (couponDiscount ? couponDiscount : 0) +
                  (addPlan ? 999 : 0)
          ).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
          })}
        </p>
      </div>
      {isTokenApplied ? (
        <div className="flex justify-between text-green-600">
          <p>Token Amount</p>
          <p className="font-semibold">
            {Number(price + (addPlan ? 999 : 0)).toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            })}
          </p>
        </div>
      ) : null}
    </Collapsible>
  );
};

export default Summary;