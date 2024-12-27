import Image from "next/image";
import React from "react";
import SideDrawer from "./SideDrawer";
import { Sheet, SheetTrigger } from "@/components/ui/couponsSheet";
import axios from "axios";
import mixpanel from "@/utils/mixpanel";

export default function SelectCoupon({
  coupons,
  originalOrderAmount,
  setCouponDiscount,
  setFinalCouponSelected,
  isSelectCouponEnabled,
  phoneNumber,
  bootcamp,
  marketingPage = false,
}: {
  coupons: any[] | undefined;
  originalOrderAmount: number;
  setCouponDiscount: Function;
  setFinalCouponSelected: Function;
  isSelectCouponEnabled: boolean;
  phoneNumber: string;
  bootcamp?: any;
  marketingPage?: boolean;
}) {
  const [openDrawer, setOpenDrawer] = React.useState<boolean>(false);
  const [couponSelected, setCouponSelected] = React.useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] = React.useState<any>();
  const [availableCoupons, setAvailableCoupons] = React.useState<any[]>(
    coupons || []
  );
  const calculateDiscount = (couponData: any) => {
    originalOrderAmount = originalOrderAmount;
    let maxDiscount = (originalOrderAmount * couponData?.discountPercent) / 100;
    if (maxDiscount > couponData?.maxDiscountPrice) {
      maxDiscount = couponData?.maxDiscountPrice;
    }
    setCouponDiscount(maxDiscount);
    return maxDiscount;
  };
  React.useEffect(() => {
    if (isSelectCouponEnabled && phoneNumber) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_API}coupons/user-specific/phone/${phoneNumber}?website=tradewise`
        )
        .then((res) => {
          if (res.data.data && coupons) {
            setAvailableCoupons([...coupons!, ...res.data.data]);
          }
        })
        .catch((error) => {
          console.log("error while fetching gold coupons: ", error);
        });
    }
  }, [isSelectCouponEnabled]);
  React.useEffect(() => {
    setFinalCouponSelected(selectedCoupon);
  }, [selectedCoupon]);
  return (
    <>
      {couponSelected ? (
        <>
          <div className="w-full h-full flex-col justify-start items-start gap-1 inline-flex">
            <div className="justify-start items-center gap-1 inline-flex">
              <Image
                src="/coupons/applyCoupon.svg"
                alt="Coupon Applied"
                width={20}
                height={20}
                className="relative"
              />
              <div className="text-[#434651] text-sm font-semibold font-['Inter']">
                Coupon Applied
              </div>
            </div>
            <div className="self-stretch px-3.5 py-2.5 bg-white rounded-lg border border-dashed border-[#aaaaaa] flex-col justify-center items-start gap-2 flex">
              <div className="self-stretch justify-between items-center inline-flex">
                <div className="text-center">
                  <span className="text-[#0a2133] font-semibold font-['Poppins']">
                    '{`${selectedCoupon?.code}`}'
                  </span>
                  <span className="text-[#0a2133]/80 font-medium font-['Poppins']">{` applied`}</span>
                </div>
                <div
                  onClick={() => {
                    setCouponSelected(false);
                    setCouponDiscount(0);
                    setFinalCouponSelected(undefined);
                    setSelectedCoupon(undefined);
                    if (!marketingPage) {
                      mixpanel.track("remove_coupon", {
                        bootcamp: bootcamp?.Bootcamp?.title,
                      });
                    }
                  }}
                  className="cursor-pointer text-[#fa3d53] text-sm font-semibold font-['Poppins']"
                >
                  REMOVE
                </div>
              </div>
              <div className="w-fit text-[#71ad53]/80 text-sm font-semibold font-['Poppins'] uppercase">
                You got extra ₹{calculateDiscount(selectedCoupon)} Off
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <Sheet
            open={openDrawer && isSelectCouponEnabled}
            onOpenChange={setOpenDrawer}
          >
            <SheetTrigger asChild type="button">
              <div
                className="cursor-pointer h-full w-full px-3 py-2.5 bg-white rounded-lg border border-dashed border-[#aaaaaa] justify-start items-center gap-2.5 inline-flex"
                onClick={() =>
                  mixpanel.track("apply_coupon", {
                    bootcamp_title: bootcamp?.Bootcamp?.title,
                    phone_number: phoneNumber,
                    source: "tradewise",
                  })
                }
              >
                <Image
                  alt="Percentage icon for coupon"
                  width={6}
                  height={6}
                  src="/coupons/applyCoupon.svg"
                  className="w-6 h-6 relative"
                />
                <div className="text-[#434651] text-sm font-semibold font-['Inter']">
                  Apply Coupon
                </div>
              </div>
            </SheetTrigger>
            <SideDrawer
              phoneNumber={phoneNumber}
              selectedCoupon={selectedCoupon}
              setSelectedCoupon={setSelectedCoupon}
              setOpenDrawer={setOpenDrawer}
              setCouponSelected={setCouponSelected}
              coupons={availableCoupons}
              bootcamp={bootcamp}
              marketingPage={marketingPage}
            />
          </Sheet>
        </>
      )}
    </>
  );
}
