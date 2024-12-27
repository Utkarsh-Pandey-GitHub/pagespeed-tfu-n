import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import mixpanel from "@/utils/mixpanel";
import axios from "axios";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { sendUsingSocket } from "@/utils/webSocket";
import Input from "@/components/form/Input";

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

export default function EnrollNowForm({
  amount,
  isOpen,
  source,
  closeModal,
  paidMcData,
  activePaidSlotInfo,
}: {
  amount?: any;
  isOpen: boolean;
  closeModal: () => void;
  source?: string;
  paidMcData: any;
  activePaidSlotInfo: any;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [userIp, setUserIp] = useState(null);

  const [paymentStatus, setPaymentStatus] = useState("");

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

  const router = useRouter();

  const submitForm = (data: Inputs) => {
    setIsLoading(true);
    let valueResult;

    if (paidMcData) {
      valueResult = paidMcData?.id;
    } else {
      valueResult = null;
    }

    let someValueArrayResult;
    if (paidMcData?.metaData?.workshopTitle) {
      someValueArrayResult = paidMcData?.metaData?.workshopTitle;
    } else {
      someValueArrayResult = paidMcData?.title;
    }

    // @ts-ignore
    gtag("event", "payment_razorpay_init", {
      event_category: "payment",
      event_label: "payment_submit",
      value: valueResult,
    });
    // const key = source;

    const sendData = {
      source: source,
      paymentStage: "razorpay_init",
      payment_type: amount?.discountedPriceDirect
        ? "discounted"
        : amount?.altamount
        ? "token"
        : "complete",
    };
    mixpanel.alias(data?.phone);
    mixpanel.people.set({
      $name: data?.name,
      $email: data?.email,
      $phone: data?.phone,
    });
    mixpanel.identify(data?.phone);
    mixpanel.track("payment_initiate", sendData);

    setUserData({
      name: data.name,
      phone: data.phone,
      email: data.email,
    });
    let wa_group_link: any;
    if (paidMcData && paidMcData?.slots?.length > 0) {
      paidMcData?.slots?.map((item: any) => {
        if (item.id === activePaidSlotInfo?.id) {
          wa_group_link = item.whatsappGroupLink;
        }
      });
    }
    if (paidMcData) {
      const leadPayload = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        slotId: activePaidSlotInfo?.id,
        source: source || router.query?.source || "direct",
        comment: "paidBootcamp",
      };

      axios.post(`${process.env.NEXT_PUBLIC_BASE_API}leads`, leadPayload);
    }

    let amountResult, paymentType;

    if (paidMcData && paidMcData?.discountedPrice) {
      amountResult = paidMcData?.discountedPrice;
    } else {
      amountResult = paidMcData?.price;
    }

    let paymentMethodResult;
    if (paidMcData) {
      paymentMethodResult = "paidBootcamp";
    } else {
      paymentMethodResult = "";
    }

    const options = {
      bootcampId: "",
      PaidmasterclassId: paidMcData ? paidMcData?.id : "",
      name: data.name,
      phone: data.phone,
      email: data.email,
      amount: "5000",
      paymentMethodType: paymentMethodResult,
      userIp: userIp,
      metadata: {
        discountedPriceToken: false,
        paymentType: paymentType,
      },
      comment: source,
      paidMc_wa_group_link: paidMcData ? wa_group_link : "",
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_BASE_API}payments/create-order`, options)
      .then(async (res) => {
        sendUsingSocket({
          type: "payment",
          status: "pending",
        });

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
          name: `Masterclass: ${
            paidMcData?.metaData?.workshopTitle || paidMcData?.title
          }`,
          description: paidMcData?.metaData?.workshopTitle || paidMcData.title,
          image:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAYAAABjPNNTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAELElEQVRYhd2YP08cRxjGfzOz/9j1gmwMVJhEREGRXGAK6hSpaenS5yPQWIrc2UUkS3QuHajjwh8grpGQkUKBFJtghADnEHfc3p/ZmUlx3s1hJ+E4zlzsRxrtnXY189tn3nnn3RG8UxzHP2VZ9n2aphHgGJKstaJer+dJkvyitf6h3W7XAQjD8Md3YP+bJqV0cRz/DCCEECoMw9+azebXgBFCqI/lUi8SQiCEsMYYGUVRM8/zL6WU0tdaSwDP88QwAQGstRhjBIDv+wCxR1f85Xk+JLR/Vq1WQyllpRBi6O5dJDlsgF70SUB6g+pICMHt27cxxjA2NgZ0YkprjVJ/J4zx8XGazSbHx8cEQUC1Wv34kEIIpJSsrKzw4MED9vb2SJIEgEajgTGG7rBXStFqtbhz5w5LS0s8f/78wjGuPN3OOaSURbooUgjGGPI8x1p7ro2MjHBycoJSip2dnZ7GuLKTSim01tRqNQDq9Xp5L8syrLXnnDw5OWFhYYG1tTUODw+vB9Ja2+nI80roPM+ZmppiZmamvF9ISsnjx4+5f/9+T/E4EEjn3DmnTk9PWVxcZG1tjUePHhGG4bnnz87O2N7exlqL53k9bSADW92FgiAA4NWrV2xubp67V7yMc51NrgiF4v+1QbZaLQBu3br1AcD7MO+Hwr+pr9XdPb0FyOjoKACjo6M456hUKhc61Ksu7aTv+2itmZ+fp1qt4vs+WZaVuXFsbIw8z5menmZxcZGjoyOCIMA5x+vXr9FaXxpSeJ4XOee2jDFfAZYe3A2CgFqtVsYfQLVapdVqkWUZWmumpqZI0xRjTLnjTE5Ocnx83AuXAwTQVEp9c2knpZR4nsfW1hZKqXKF3rx5k3a7TRRFCCGoVCrs7u6itebevXusrq7y9u3byw4H9DHdzjlu3LhBEARMTExQq9XwfR8pJUEQlLuK1po0TZmensZay9OnT/sC7BuyW1JKwjAkSRLSNEVrTRiGZf5bX1/n4cOHvHz5kn5L1yunoEajwezsLMvLy7x48YJWq0WSJGUqqlarNJtN4MMXvDbIorB48+YNBwcHAFQqlQ+eC4KAdrvd1xhXroKKqsf3/f+czn4BYQCQxpirdnGhPonPh88XUkpJlmWcnp5y9+5dnj17xubmJnEcD5qvI8/zIqXUDp2tyNDDOU2SJC7LMmetdfv7+25ubm7QZ0H23bWhlPqirxQ0MjLC+vo6GxsbPHnyBGstURSV+XDg6sfJokVRVP72ff+jOXmlhdPtXD8lWK/6fFf3dauAHNrx8wVyzrmywJBA36XUINVdKUVRJPM8F16e580gCHaAWWOMuSzooD62uiToZBnPGLNnjPkDAN/354DfhRBOSnmpJoQYaAOK659xHH9bUEvAKqVSKeV3QoiYTp4axtw7KaUAjNb6V2PMASD/AtDPYOlV/rQjAAAAAElFTkSuQmCC",
          handler: async function (response: any) {
            if (paidMcData) {
              window.location.href = "https://thefuture.university";
            }
          },
          order_id: gatewayOrderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
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
    if (paymentStatus == PAYMENT_STATUS.COMPLETED) {
      mixpanel.track("purchase", {
        livekit: paidMcData?.title ?? "",
        info: localStorage["tfu-user-auth"]
          ? JSON.parse(localStorage["tfu-user-auth"])
          : null,
      });
    }
  }, [paymentStatus]);

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
                        Enroll Now
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
                        <form onSubmit={handleSubmit(submitForm)}>
                          <div
                            className="mb-3"
                            onClick={() => {
                              //   mixpanel.track("form_start", {
                              //     input: "Name edited",
                              //     bootcamp: bootcamp?.title,
                              //   });
                            }}
                          >
                            <Input
                              label="Name"
                              type="text"
                              name="name"
                              placeholder="John Doe"
                              register={register}
                              errors={errors}
                              rules={{ required: true }}
                            />
                          </div>

                          <div
                            className="mb-3"
                            onClick={() => {
                              //   mixpanel.track("form_start", {
                              //     input: "Email edited",
                              //     bootcamp: bootcamp?.title,
                              //   });
                            }}
                          >
                            <Input
                              type="email"
                              name="email"
                              label="Email"
                              placeholder="someone@somewhere.com"
                              register={register}
                              errors={errors}
                              rules={{ required: true }}
                            />
                          </div>

                          <div
                            className="mb-3"
                            onClick={() => {
                              //   mixpanel.track("form_start", {
                              //     input: "Phone number edited",
                              //     bootcamp: bootcamp?.title,
                              //   });
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
                              className="btn-block mt-3 btn-blue btn-lg pulse-button !tracking-wider !text-2xl"
                            >
                              Enroll Now
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
  );
}
