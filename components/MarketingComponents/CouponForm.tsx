import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "@/components/form/Input";
import SelectCoupon from "@/components/coupons/SelectCoupon";
import TradeWiseImage from "@/marketingUtils/tradeWiseIcon";

type Inputs = {
  name: string;
  email: string;
  phone: string;
};


export default function CouponForm({
  amount,
  isOpen,
  closeModal,
  masterClassData,
  activePaidSlotInfo,
  source,
  leadComment,
  backComment,
  customRedirect,
  activeWAGroup,
  fullDomain,
  masterClassId,
  isCustom = false,
  customToken,
  buttonClass,
  buttonText,
  couponData,
}: {
  amount?: number;
  isOpen: boolean;
  customRedirect?: string;
  closeModal: () => void;
  masterClassData: any;
  activePaidSlotInfo?: any;
  source?: string | string[] | undefined;
  leadComment?: string | string[] | undefined;
  backComment?: string;
  activeWAGroup?: string;
  fullDomain?: string;
  masterClassId: string;
  isCustom?: boolean;
  customToken?: string;
  buttonClass?: string;
  buttonText?: string;
  couponData?: any;
}) {
  const [userIp, setUserIp] = useState(null);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [finalCouponSelected, setFinalCouponSelected] =
    useState<any>(undefined);

  const redirectURL = `${fullDomain}/${masterClassId}/redirect/thanks-paid`;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<Inputs>();

  const submitForm = (data: Inputs) => {
    setIsLoading(true);
    const masterClassName =
      masterClassData?.metaData?.workshopTitle || masterClassData?.title;

    setUserData({
      name: data.name,
      phone: data.phone,
      email: data.email,
    });

    const leadPayload = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      slotId: activePaidSlotInfo?.id,
      source: source || "direct",
      comment: leadComment || "No Comment",
    };

    axios.post(`${process.env.NEXT_PUBLIC_BASE_API}leads`, leadPayload);

    const options = {
      masterClassId: masterClassData?.id || "",
      name: data.name,
      phone: data.phone,
      email: data.email,
      paymentMethodType: backComment,
      userIp: userIp,
      comment: leadComment,
      paidMc_wa_group_link: activeWAGroup,
      couponId: finalCouponSelected?.id,
      origin: window.location.href,
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_BASE_API}payments/create-order`, options)
      .then(async (res) => {

        const { id, gatewayOrderId } = res.data.data;
        let { amount } = res.data.data;

        const options = {
          prefill: {
            name: data.name,
            email: data.email,
            contact: "+91" + String(data.phone),
          },
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
          amount: Number(amount),
          currency: "INR",
          name: `Masterclass: ${masterClassName}`,
          description:
            masterClassData?.metaData?.workshopTitle || masterClassData.title,
          image: TradeWiseImage,
          handler: async function (response: any) {
            window.location.href =
              customRedirect ||
              redirectURL ||
              activeWAGroup ||
              "https://tradewiseapp.com/";
          },
          order_id: gatewayOrderId,
          theme: {
            color: "#000",
          },
        };

        // @ts-ignore
        const rzp1 = new window.Razorpay(options);
        setIsLoading(false);
        rzp1.open();
      });
  };

  useEffect(() => {
    if (Object.keys(userData).length != 0) {
      localStorage.setItem("tfu-user-auth", JSON.stringify(userData));
    }
  }, [userData]);

  useEffect(() => {
    axios
      .get("https://api64.ipify.org/")
      .then((res) => {
        setUserIp(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    const userDetails = JSON.parse(
      String(localStorage.getItem("tfu-user-auth"))
    );
    if (userDetails) {
      reset({
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone,
      });
    }
  }, []);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full md:items-center justify-center md:p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full flex flex-col gap-5 md:border-4 md:max-w-md transform overflow-hidden md:rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-center w-full mb-2"
                    >
                      {buttonText ? buttonText : "Enroll Now"}
                    </Dialog.Title>
                    <span>
                      <XMarkIcon
                        className="w-5 h-5 cursor-pointer"
                        onClick={closeModal}
                      />
                    </span>
                  </div>
                  <div>
                    <form
                      onSubmit={handleSubmit(submitForm)}
                      className="flex flex-col gap-4"
                    >
                      <Input
                        label="Name"
                        type="text"
                        name="name"
                        placeholder="Harshad Mehta"
                        register={register}
                        errors={errors}
                        rules={{ required: true }}
                      />
                      <Input
                        type="email"
                        name="email"
                        label="Email"
                        placeholder="harshad@gmail.com"
                        register={register}
                        errors={errors}
                        rules={{ required: true }}
                      />
                      <Input
                        type="number"
                        name="phone"
                        label="phone"
                        placeholder="Enter your phone number"
                        register={register}
                        errors={errors}
                        rules={{
                          required: true,
                          maxLength: {
                            value: 10,
                            message: "Invalid Phone Number",
                          },
                          minLength: {
                            value: 10,
                            message: "Invalid Phone Number",
                          },
                        }}
                      />
                      <SelectCoupon
                        phoneNumber={watch("phone")}
                        coupons={couponData}
                        originalOrderAmount={99}
                        isSelectCouponEnabled={true}
                        setFinalCouponSelected={setFinalCouponSelected}
                        setCouponDiscount={setCouponDiscount}
                        marketingPage={true}
                      />
                      <div className="mt-4 bottom-3 inset-x-3">
                        <button
                          type="submit"
                          className={`btn-block mt-3 btn-blue btn-lg !tracking-wide !text-2xl ${buttonClass ? ` ${buttonClass}` : ""
                            }  pulse-button `}
                          disabled={isLoading}
                        >
                          {isLoading
                            ? `loading..`
                            : `Enroll Now AT ₹${(
                              99 -
                              (99 * couponDiscount) / 100
                            ).toFixed(0)}`}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
