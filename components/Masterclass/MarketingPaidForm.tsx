import axios from "axios";
import { useRouter } from "next/router";
import mixpanel from "@/utils/mixpanel";
import { useForm } from "react-hook-form";
import Input from "@/components/form/Input";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import tradewiseIcon from "@/marketingUtils/tradeWiseIcon"
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import BumpOfferModal from "../MarketingComponents/bump-offer-component/BumpOfferModal";

type Inputs = {
  name: string;
  email: string;
  phone: string;
};
const PAYMENT_STATUS = {
  COMPLETED: "COMPLETED",
  PENDING: "PENDING",
  FAILED: "FAILED",
};

enum paymentTockens {
  FACEBOOK =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbW91bnQiOjk5fQ.4Ln6tNDxvsLnO_jvL1_pFoRzaEPiaaa5Mxus3KKJEA8",
  GOOGLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbW91bnQiOjQ5fQ.CxV6Wx22zOtz70T6JXG79RZVCpx5ygSqUTgSf-eNwsA",
  CUSTOM = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbW91bnQiOjE5OX0.PuzNQ0M-j_JtLU2YKhkEsmXTjHAfx-L389zz-5UhgcY"
};

export default function MarketingEnrollNowForm({
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
  isBumpOffer,
  abTestCounter,
  slug,
  abTestType,
  pageDesc,
  bumpOfferArray,
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
  abTestCounter?: number;
  slug?: string;
  isBumpOffer?: boolean;
  bumpOfferArray?: any[];
  abTestType?: string;
  pageDesc?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [userIp, setUserIp] = useState(null);
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState("");
  const path = router.pathname;
  const redirectURL = `${fullDomain}/${masterClassId}/redirect/thanks-paid`;

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
  }, []);

  const bucket = abTestCounter ? (abTestCounter % 10 == 1 || abTestCounter % 10 == 2 ? "Exp" : "Control") : "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
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

  const submitForm = (data: Inputs) => {

    setIsLoading(true);
    const masterClassId = masterClassData?.id;
    const masterClassName =
      masterClassData?.metaData?.workshopTitle || masterClassData?.title;

    // @ts-ignore
    gtag("event", "payment_razorpay_init", {
      event_category: "payment",
      event_label: "payment_submit",
      value: masterClassId,
    });
    // const key = source;
    const sendData = {
      source: source,
      paymentStage: "razorpay_init",
      payment_type: "discounted",
      masterClassId: masterClassData?.id,
      platform: "tradewise"
    };
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
      slotId: activePaidSlotInfo?.id,
      source: source || "direct",
      comment: leadComment || "No Comment",
      ...(bucket && abTestType && {
        payload: {
          bucket,
          pageDesc,
          abTestType,
        },
      }),
    };
    axios.post(`${process.env.NEXT_PUBLIC_BASE_API}leads`, leadPayload);

    const inputs = [{ name: "email", value: data.email }]
    const tagPayload = {
      event: "contactFormSubmitted",
      formId: 2,
      "gtm.uniqueEventId": Math.floor(Math.random() * 1000),
      inputs
    }
    const customEvent = new CustomEvent("lead_form_submitted", {
      detail: {
        tagPayload
      },
    });
    document.dispatchEvent(customEvent);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "lead_form_submitted" })
    window.dataLayer.push(tagPayload);
    //@ts-ignore
    gtag("event", "contactFormSubmitted", tagPayload);

    mixpanel.track("lead_submit", {
      source: router.query.source || "direct",
      comment: router.query.comment || "no_comment",
      type: "paid",
      masterclassId: masterClassId
    })

    const options = {
      masterClassId: masterClassData?.id || "",
      name: data.name,
      phone: data.phone,
      email: data.email,
      paymentMethodType: backComment,
      userIp: userIp,
      comment: leadComment,
      paidMc_wa_group_link: activeWAGroup,
      origin: window.location.href,
      token:
        customToken ? customToken : isCustom ? paymentTockens.CUSTOM : source === "facebook" ? paymentTockens.FACEBOOK : paymentTockens.GOOGLE,
    };

    mixpanel.track("payment_initiate", sendData);


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
          image: tradewiseIcon,
          handler: async function (response: any) {
            mixpanel.track("purchase", {
              page_referrer: document.referrer,
              platform: "tradewise",
              amount: amount,
              masterClassId: masterClassData?.id,
            })
            window.location.href =
              customRedirect || redirectURL || activeWAGroup || "https://tradewiseapp.com/";
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
  };
  useEffect(() => {
    if (paymentStatus == PAYMENT_STATUS.COMPLETED) {
      mixpanel.track("purchase", {
        livekit: masterClassData?.title ?? "",
        info: localStorage["tfu-user-auth"]
          ? JSON.parse(localStorage["tfu-user-auth"])
          : null,
      });
    }
  }, [paymentStatus]);

  const [isBumpModalOpen, setIsBumpModalOpen] = useState(false);

  const leadHandler = (data: Inputs) => {
    const path = router.pathname;

    const masterClassId = masterClassData?.id;
    const masterClassName =
      masterClassData?.metaData?.workshopTitle || masterClassData?.title;

    // @ts-ignore
    gtag("event", "payment_razorpay_init", {
      event_category: "payment",
      event_label: "payment_submit",
      value: masterClassId,
    });
    // const key = source;
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
      slotId: activePaidSlotInfo?.id,
      source: source || "direct",
      comment: leadComment || "No Comment",
      ...(bucket && abTestType && {
        payload: {
          bucket,
          pageDesc,
          abTestType,
        },
      }),
    };
    axios.post(`${process.env.NEXT_PUBLIC_BASE_API}leads`, leadPayload);

    const inputs = [{ name: "email", value: data.email }]
    const tagPayload = {
      event: "contactFormSubmitted",
      formId: 2,
      "gtm.uniqueEventId": Math.floor(Math.random() * 1000),
      inputs
    }
    const customEvent = new CustomEvent("lead_form_submitted", {
      detail: {
        tagPayload
      },
    });
    document.dispatchEvent(customEvent);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "lead_form_submitted" })
    window.dataLayer.push(tagPayload);
    //@ts-ignore
    gtag("event", "contactFormSubmitted", tagPayload);
    
    mixpanel.track("lead_submit", {
      source: router.query.source || "direct",
      comment: router.query.comment || "no_comment",
      type: "paid",
      masterclassId: masterClassId
    })

  }
  async function exportToBumpExcel(data: any, selectedOffers: number[], totalPrice: number, source: any, comment: any) {
    if (!data.name || !data.email || !data.phone) return;
    const formData = new FormData();
    formData.append('platform', "bump-details");
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('lifetimeAccess', selectedOffers.includes(1) ? 'Yes' : 'No');
    formData.append('chatGPT', selectedOffers.includes(2) ? 'Yes' : 'No');
    formData.append('bumpTotal', totalPrice.toString());
    formData.append('source', source);
    formData.append('comment', comment);
    try {
      await axios.post(process.env.NEXT_PUBLIC_GOOGLE_SHEET_TRADEWISE_LEAD!, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    }
    catch (error) {
      console.error(error);
    }
  }
  const paymentHandler = (data: Inputs, bumpToken?: any, selectedOffers?: any, totalPrice?: any) => {
    const masterClassId = masterClassData?.id;
    const masterClassName =
      masterClassData?.metaData?.workshopTitle || masterClassData?.title;

    const sendData = {
      source: source,
      paymentStage: "razorpay_init",
      payment_type: "discounted",
      masterClassId: masterClassData?.id,
      platform: "tradewise"
    };

    mixpanel.track("payment_initiate", sendData);

    const options = {
      masterClassId: masterClassData?.id || "",
      name: data.name,
      phone: data.phone,
      email: data.email,
      paymentMethodType: backComment,
      userIp: userIp,
      comment: leadComment,
      paidMc_wa_group_link: activeWAGroup,
      origin: window.location.href,
      token:
        bumpToken ? bumpToken :
          customToken ? customToken :
            isCustom ? paymentTockens.CUSTOM :
              source === "facebook" ? paymentTockens.FACEBOOK : paymentTockens.GOOGLE,
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
          image:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAYAAABjPNNTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAELElEQVRYhd2YP08cRxjGfzOz/9j1gmwMVJhEREGRXGAK6hSpaenS5yPQWIrc2UUkS3QuHajjwh8grpGQkUKBFJtghADnEHfc3p/ZmUlx3s1hJ+E4zlzsRxrtnXY189tn3nnn3RG8UxzHP2VZ9n2aphHgGJKstaJer+dJkvyitf6h3W7XAQjD8Md3YP+bJqV0cRz/DCCEECoMw9+azebXgBFCqI/lUi8SQiCEsMYYGUVRM8/zL6WU0tdaSwDP88QwAQGstRhjBIDv+wCxR1f85Xk+JLR/Vq1WQyllpRBi6O5dJDlsgF70SUB6g+pICMHt27cxxjA2NgZ0YkprjVJ/J4zx8XGazSbHx8cEQUC1Wv34kEIIpJSsrKzw4MED9vb2SJIEgEajgTGG7rBXStFqtbhz5w5LS0s8f/78wjGuPN3OOaSURbooUgjGGPI8x1p7ro2MjHBycoJSip2dnZ7GuLKTSim01tRqNQDq9Xp5L8syrLXnnDw5OWFhYYG1tTUODw+vB9Ja2+nI80roPM+ZmppiZmamvF9ISsnjx4+5f/9+T/E4EEjn3DmnTk9PWVxcZG1tjUePHhGG4bnnz87O2N7exlqL53k9bSADW92FgiAA4NWrV2xubp67V7yMc51NrgiF4v+1QbZaLQBu3br1AcD7MO+Hwr+pr9XdPb0FyOjoKACjo6M456hUKhc61Ksu7aTv+2itmZ+fp1qt4vs+WZaVuXFsbIw8z5menmZxcZGjoyOCIMA5x+vXr9FaXxpSeJ4XOee2jDFfAZYe3A2CgFqtVsYfQLVapdVqkWUZWmumpqZI0xRjTLnjTE5Ocnx83AuXAwTQVEp9c2knpZR4nsfW1hZKqXKF3rx5k3a7TRRFCCGoVCrs7u6itebevXusrq7y9u3byw4H9DHdzjlu3LhBEARMTExQq9XwfR8pJUEQlLuK1po0TZmensZay9OnT/sC7BuyW1JKwjAkSRLSNEVrTRiGZf5bX1/n4cOHvHz5kn5L1yunoEajwezsLMvLy7x48YJWq0WSJGUqqlarNJtN4MMXvDbIorB48+YNBwcHAFQqlQ+eC4KAdrvd1xhXroKKqsf3/f+czn4BYQCQxpirdnGhPonPh88XUkpJlmWcnp5y9+5dnj17xubmJnEcD5qvI8/zIqXUDp2tyNDDOU2SJC7LMmetdfv7+25ubm7QZ0H23bWhlPqirxQ0MjLC+vo6GxsbPHnyBGstURSV+XDg6sfJokVRVP72ff+jOXmlhdPtXD8lWK/6fFf3dauAHNrx8wVyzrmywJBA36XUINVdKUVRJPM8F16e580gCHaAWWOMuSzooD62uiToZBnPGLNnjPkDAN/354DfhRBOSnmpJoQYaAOK659xHH9bUEvAKqVSKeV3QoiYTp4axtw7KaUAjNb6V2PMASD/AtDPYOlV/rQjAAAAAElFTkSuQmCC",
          handler: async function (response: any) {
            mixpanel.track("purchase", {
              page_referrer: document.referrer,
              platform: "tradewise",
              amount: amount,
              masterClassId: masterClassId
            })
            if (selectedOffers) {
              setIsBumpModalOpen(false)
              await exportToBumpExcel(data, selectedOffers, totalPrice, source, backComment);
            }
            window.location.href =
              customRedirect || redirectURL || activeWAGroup || "https://tradewiseapp.com/";
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
  const handleClick = (data: Inputs) => {
    if (isBumpOffer) {
      leadHandler(data);
      closeModal();
      setIsBumpModalOpen(true);
    }
    else {
      submitForm(data);
    }
  }

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
                  {(paymentStatus == PAYMENT_STATUS.COMPLETED && (
                    <div className="flex flex-col justify-center items-center text-center h-full">
                      <span>
                        <XMarkIcon
                          className="w-8 h-8 cursor-pointer absolute top-5 right-5"
                          onClick={closeModal}
                        />
                      </span>
                      <CheckCircleIcon className="w-20 h-20 text-green-500 mb-3 mx-auto ring-2 ring-green-400/50 rounded-full" />
                      <p>
                        <b>PAYMENT SUCCESSFUL</b>
                      </p>
                      <p>
                        Thank you for your payment. Our program manager will
                        contact you with further details.
                      </p>
                    </div>
                  )) || (
                      <div>
                        <div className="flex items-center justify-between">
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6"
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
                        {!isLoading && (
                          <div>
                            <form onSubmit={handleSubmit(handleClick)}>
                              <div
                                className="mb-3"
                                onClick={() => {
                                  mixpanel.track("marketing_form", {
                                    input: "Name Edited",
                                    type: "paid"
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
                                    type: "paid"
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
                                    type: "paid"
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
                                  className={`btn-block mt-3 btn-blue btn-lg !tracking-wider !text-2xl${buttonClass ? ` ${buttonClass}` : ""}  pulse-button `}
                                >
                                  {buttonText ? buttonText : "Enroll Now"}
                                </button>
                                <p className=" text-xs p-2 text-gray-500">
                                  *You&apos;re eligible for a full refund upon
                                  canceling at least 14 days before the class
                                  begins.
                                </p>
                              </div>
                            </form>
                          </div>
                        )}
                        {isLoading && (
                          <div role="status">
                            <svg
                              aria-hidden="true"
                              className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                              />
                            </svg>
                            <span className="sr-only">Loading...</span>
                          </div>
                        )}
                      </div>
                    )}
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
        token={amount == 49 ? paymentTockens.GOOGLE : amount == 99 ? paymentTockens.FACEBOOK : customToken}
        bumpOffers={bumpOfferArray}
        basePrice={amount as number}
      />
    </div>
  );
}
