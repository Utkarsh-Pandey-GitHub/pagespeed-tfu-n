import { useState } from "react";
import { SheetContent } from "@/components/ui/couponsSheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import CouponTicket from "./CouponTicket";
import { useForm } from "react-hook-form";
import axios from "axios";
import mixpanel from "@/utils/mixpanel";

export default function SideDrawer({
  coupons,
  setOpenDrawer,
  setCouponSelected,
  setSelectedCoupon,
  selectedCoupon,
  phoneNumber,
  bootcamp,
  marketingPage = false,
}: {
  coupons: any[] | undefined;
  setOpenDrawer: Function;
  setCouponSelected: Function;
  setSelectedCoupon: Function;
  selectedCoupon: boolean;
  phoneNumber: string;
  bootcamp?: any;
  marketingPage?: boolean;
}) {
  const {
    formState: { errors },
  } = useForm();
  const [showYayModal, setShowYayModal] = useState<boolean>(false);
  const [isInputNotEmpty, setIsInputNotEmpty] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplyError, setCouponApplyError] = useState<string>("");
  const handleInputChange = (event: any) => {
    setIsInputNotEmpty(event.target.value.length > 0);
    setCouponCode(event.target?.value);
  };

  const fetchCoupon = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API}coupons/code/${couponCode}?phone=${phoneNumber}&website=tradewise`
      );
      setSelectedCoupon(data?.data);
      setShowYayModal(true);
    } catch (error: any) {
      setCouponApplyError(
        error?.response?.data?.message ||
          error?.message ||
          "Error while applying coupon code"
      );
    }
  };

  return (
    <SheetContent
      side="right"
      className="!w-[100vw] !max-w-[100vw] lg:!w-[30vw] lg:!max-w-[30vw] bg-white lg:!pt-[71px] !px-0"
    >
      <div className="w-full flex items-center justify-between p-4">
        <div className="flex flex-col gap-2 px-[12px] lg:px-[20px] w-full">
          <div className="w-full h-auto flex-col justify-start items-start gap-2 inline-flex">
            <div className="max-w-[80%] lg:self-stretch text-black/70 text-base font-semibold font-['Poppins']">
              Have a coupon code? Redeem it here.
            </div>
            <div className="flex flex-col gap-1 w-full ">
              <div className="relative self-stretch bg-white rounded-lg shadow border border-[#aaaaaa]">
                <input
                  type="text"
                  placeholder="Enter Coupon Code"
                  name="couponCode"
                  className="h-12 px-4 py-6 !pr-[20%]"
                  onChange={handleInputChange}
                />

                <button
                  onClick={fetchCoupon}
                  className={`text-[#fe5200] outline-none border-none absolute top-1/2 -translate-y-1/2 bg-white right-0.5 px-4 text-base font-semibold font-['Poppins']`}
                >
                  APPLY
                </button>
              </div>
              <span className="text-sm text-red-500">
                {couponApplyError ? couponApplyError : null}
              </span>
            </div>
            <div className="w-fit lg:w-[376px] text-[#002081] text-md lg:text-lg font-semibold font-['Inter'] leading-[30.61px]">
              Available Coupons
            </div>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 h-[70vh] overflow-y-auto w-full bg-[#f1f0f5]">
        <div className="flex p-4 md:p-6 h-full items-center justify-center">
          <CouponTicket
            setShowYayModal={setShowYayModal}
            showYayModal={showYayModal}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            setCouponSelected={setCouponSelected}
            setOpenDrawer={setOpenDrawer}
            coupons={coupons}
          />
        </div>
      </ScrollArea>
    </SheetContent>
  );
}
