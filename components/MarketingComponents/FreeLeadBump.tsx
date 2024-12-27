import React from 'react'
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form"
import Input from "@/components/form/Input";
import mixpanel from "@/utils/mixpanel";
import axios from 'axios';
import { useRouter } from 'next/router';
import BumpOfferModal from './bump-offer-component/BumpOfferModal';
import image from '@/marketingUtils/tradeWiseIcon';

type Inputs = {
  name: string;
  email: string;
  phone: string;
};
function FreeLeadBump(
  { masterClass,
    isOpen,
    closeModal,
    bucket,
    bumpOfferArray
  }: {
    masterClass: any
    isOpen: boolean;
    closeModal: () => void;
    bucket: String
    bumpOfferArray: any[]
  }
) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const [userIp, setUserIp] = useState(null)
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isBumpModalOpen, setIsBumpModalOpen] = useState<boolean>(false);

  const router = useRouter()

  const activeSlot = masterClass?.slots?.find((slot: any) => {
    return slot.active;
  });
  const activeWAGroup = activeSlot?.whatsappGroupLink;

  const source = router?.query?.source
  const comment = router?.query?.comment
  const backComment = source === "google" ? "paidMasterClass" : "paidBootcamp";

  const submitForm = (data: Inputs) => {


    mixpanel.alias(data?.phone);
    mixpanel.people.set({
      $name: data?.name,
      $email: data?.email,
      $phone: data?.phone,
    });
    mixpanel.identify(data?.phone);

    setUserData({
      name: data.name,
      phone: data.phone,
      email: data.email,
    });


    const leadPayload = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      slotId: activeSlot?.id,
      source: source || "direct",
      comment: comment || "No Comment",
      payload: {
        bucket,
        abTestType: "free-normal-bump"
      },
    };

    axios.post(`${process.env.NEXT_PUBLIC_BASE_API}leads`, leadPayload);

    mixpanel.track("lead_submit", {
      source: source || "direct",
      comment: comment || "no_comment",
      type: "free",
      masterclassId: masterClass?.id
    })

    closeModal();

    setIsBumpModalOpen(true)

  }

  const paymentHandler = (data: Inputs, bumpToken?: any, selectedOffers?: any, totalPrice?: any) => {
    setIsLoading(true)
    const masterClassId = masterClass?.id;
    const masterClassName =
      masterClass?.metaData?.workshopTitle || masterClass?.title;

    const sendData = {
      source: source,
      paymentStage: "razorpay_init",
      payment_type: "bumpOffer",
      masterClassId: masterClass?.id,
      platform: "tradewise"
    };

    mixpanel.track("payment_initiate", sendData);

    const options = {
      masterClassId: masterClass?.id || "",
      name: data.name,
      phone: data.phone,
      email: data.email,
      paymentMethodType: backComment,
      userIp: userIp,
      comment: comment,
      paidMc_wa_group_link: activeWAGroup,
      origin: window.location.href,
      token:
        bumpToken
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
            masterClass?.metaData?.workshopTitle || masterClass.title,
          image:
            image,
          handler: async function (response: any) {
            mixpanel.track("purchase", {
              page_referrer: document.referrer,
              platform: "tradewise",
              amount: amount,
              masterClassId: masterClassId
            })
            window.location.href =
              `https://tradewise.thefuture.university/${masterClass?.id}/redirect/thanks-paid`;
          },
          order_id: gatewayOrderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          theme: {
            color: "#000",
          },
        };


        // @ts-ignore
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });

  }

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
    <div>
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
                        className="text-lg font-medium leading-6"
                      >
                        Enroll Now
                      </Dialog.Title>
                      <span>
                        <XMarkIcon
                          className="w-5 h-5 cursor-pointer"
                          onClick={closeModal}
                        />
                      </span>
                    </div>
                    <div>
                      <form onSubmit={handleSubmit(submitForm)}>
                        <div
                          className="mb-3"
                          onClick={() => {
                            mixpanel.track("marketing_form", {
                              input: "Name Edited",
                              type: "free"
                            })
                          }}
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
                        </div>

                        <div
                          className="mb-3"
                          onClick={() => {
                            mixpanel.track("marketing_form", {
                              input: "Email Edited",
                              type: "free"
                            })
                          }}
                        >
                          <Input
                            type="email"
                            name="email"
                            label="Email"
                            placeholder="harshad@gmail.com"
                            register={register}
                            errors={errors}
                            rules={{ required: true }}
                          />
                        </div>

                        <div
                          className="mb-3"
                          onClick={() => {
                            mixpanel.track("marketing_form", {
                              input: "Phone Edited",
                              type: "free"
                            })
                          }}
                        >
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
                        </div>
                        <div className="mt-4 bottom-3 inset-x-3">
                          <button
                            type="submit"
                            className={`btn-block mt-3 btn-blue btn-lg !text-2xl pulse-button `}
                          >
                            {isLoading ? "loading.." : "Enroll Now For Free"}
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
      <BumpOfferModal
        isOpen={isBumpModalOpen}
        setIsOpen={setIsBumpModalOpen}
        onClose={paymentHandler as any}
        data={userData}
        loading={isLoading}
        token={"nothing"}
        bumpOffers={bumpOfferArray}
        basePrice={0}
        redirectLink={activeSlot?.whatsappGroupLink}
        freePage
      />
    </div>
  )
}

export default FreeLeadBump