import Modal from "@/components/ui/Modal";
import mixpanel from "@/utils/mixpanel";
import { sendUsingSocket } from "@/utils/webSocket";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registrationSchema } from "@/components/Masterclass/New-lead-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import webengage from "@/webengage";
import { paymentType } from "@/utils/bootcamp";

type Inputs = z.infer<typeof registrationSchema>;

const AB_TEST_BUCKET = [
  {
    id: "4_20off_privacymsg",
    category: "formType",
    title: "Please confirm your details",
    cta: "Pay Now!",
    showPrivacyMessage: true,
  },
];

const PAYMENT_STATUS = {
  COMPLETED: "COMPLETED",
  PENDING: "PENDING",
  FAILED: "FAILED",
};

export default function EnrollNowForm({
  redirect = true,
  isOpen,
  type,
  onClose,
  _data,
  source = "website",
}: {
  isOpen: boolean;
  redirect?: boolean;
  type?: paymentType | null;
  source?: string;
  _data: {
    type: string;
    price: number;
    discountedPrice: number;
    duration: string;
  };
  onClose: () => void;
}) {
  const [bucket, setBucket] = useState(
    AB_TEST_BUCKET[Math.floor(Math.random() * AB_TEST_BUCKET.length)]
  );
  const [userData, setUserData] = useState({});
  const [userIp, setUserIp] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    if (Object.keys(userData).length != 0) {
      localStorage.setItem("tfu-user-auth", JSON.stringify(userData));
    }
  }, [userData]);

  function setImpression(id: string, category?: string) {
    axios.post(`${process.env.NEXT_PUBLIC_BASE_API}abtest/setimpression`, {
      type: id,
      category: category,
    });
  }

  function setConversion(id: string, category?: string) {
    axios.post(`${process.env.NEXT_PUBLIC_BASE_API}abtest/setconversion`, {
      type: id,
      category: category,
    });
  }

  useEffect(() => {
    setImpression(bucket.id, bucket.category);
  }, []);

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

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    const userDetails = JSON.parse(
      String(localStorage.getItem("tfu-user-auth"))
    );
    if (userDetails) {
      form.reset({
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone,
      });
    }
  }, []);

  const router = useRouter();

  const submitForm = async (data: Inputs) => {
    setIsProcessing(true);
    const valueResult = "";

    // @ts-ignore
    gtag("event", "payment_razorpay_init", {
      event_category: "payment",
      event_label: "payment_submit",
      value: valueResult,
    });
    const someValueArrayResult = "";
    const key = source;
    const someValueArray = [someValueArrayResult];

    const sendData = {
      source: source,
      paymentStage: "razorpay_init",
      [key]: someValueArray,
      payment_type: type,
    };
    mixpanel.alias(data?.phone);
    mixpanel.people.set({
      $name: data?.name,
      $email: data?.email,
      $phone: data?.phone,
    });
    mixpanel.identify(data?.phone);
    mixpanel.track("payment_initiate", sendData);

    setConversion(bucket.id, bucket.category);

    setUserData({
      name: data.name,
      phone: data.phone,
      email: data.email,
    });

    const options = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      platform: "Tradewise",
      paymentMethodType: "gold",
      userIp: userIp,
      comment: source,
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
          name: "Gold Payment",
          description: "Gold Payment",
          image:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAYAAABjPNNTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAELElEQVRYhd2YP08cRxjGfzOz/9j1gmwMVJhEREGRXGAK6hSpaenS5yPQWIrc2UUkS3QuHajjwh8grpGQkUKBFJtghADnEHfc3p/ZmUlx3s1hJ+E4zlzsRxrtnXY189tn3nnn3RG8UxzHP2VZ9n2aphHgGJKstaJer+dJkvyitf6h3W7XAQjD8Md3YP+bJqV0cRz/DCCEECoMw9+azebXgBFCqI/lUi8SQiCEsMYYGUVRM8/zL6WU0tdaSwDP88QwAQGstRhjBIDv+wCxR1f85Xk+JLR/Vq1WQyllpRBi6O5dJDlsgF70SUB6g+pICMHt27cxxjA2NgZ0YkprjVJ/J4zx8XGazSbHx8cEQUC1Wv34kEIIpJSsrKzw4MED9vb2SJIEgEajgTGG7rBXStFqtbhz5w5LS0s8f/78wjGuPN3OOaSURbooUgjGGPI8x1p7ro2MjHBycoJSip2dnZ7GuLKTSim01tRqNQDq9Xp5L8syrLXnnDw5OWFhYYG1tTUODw+vB9Ja2+nI80roPM+ZmppiZmamvF9ISsnjx4+5f/9+T/E4EEjn3DmnTk9PWVxcZG1tjUePHhGG4bnnz87O2N7exlqL53k9bSADW92FgiAA4NWrV2xubp67V7yMc51NrgiF4v+1QbZaLQBu3br1AcD7MO+Hwr+pr9XdPb0FyOjoKACjo6M456hUKhc61Ksu7aTv+2itmZ+fp1qt4vs+WZaVuXFsbIw8z5menmZxcZGjoyOCIMA5x+vXr9FaXxpSeJ4XOee2jDFfAZYe3A2CgFqtVsYfQLVapdVqkWUZWmumpqZI0xRjTLnjTE5Ocnx83AuXAwTQVEp9c2knpZR4nsfW1hZKqXKF3rx5k3a7TRRFCCGoVCrs7u6itebevXusrq7y9u3byw4H9DHdzjlu3LhBEARMTExQq9XwfR8pJUEQlLuK1po0TZmensZay9OnT/sC7BuyW1JKwjAkSRLSNEVrTRiGZf5bX1/n4cOHvHz5kn5L1yunoEajwezsLMvLy7x48YJWq0WSJGUqqlarNJtN4MMXvDbIorB48+YNBwcHAFQqlQ+eC4KAdrvd1xhXroKKqsf3/f+czn4BYQCQxpirdnGhPonPh88XUkpJlmWcnp5y9+5dnj17xubmJnEcD5qvI8/zIqXUDp2tyNDDOU2SJC7LMmetdfv7+25ubm7QZ0H23bWhlPqirxQ0MjLC+vo6GxsbPHnyBGstURSV+XDg6sfJokVRVP72ff+jOXmlhdPtXD8lWK/6fFf3dauAHNrx8wVyzrmywJBA36XUINVdKUVRJPM8F16e580gCHaAWWOMuSzooD62uiToZBnPGLNnjPkDAN/354DfhRBOSnmpJoQYaAOK659xHH9bUEvAKqVSKeV3QoiYTp4axtw7KaUAjNb6V2PMASD/AtDPYOlV/rQjAAAAAElFTkSuQmCC",
          handler: async function (response: any) {
            if (redirect) {
              router.push(`/gold/success`);
            } else {
              const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_API}payments/${id}`
              );
              if (data) {
                if (data.data.status == PAYMENT_STATUS.COMPLETED) {
                  setPaymentStatus(PAYMENT_STATUS.COMPLETED);
                  sendUsingSocket({
                    type: "payment",
                    status: "success",
                  });
                } else if (data.data.status == PAYMENT_STATUS.PENDING) {
                  setPaymentStatus(PAYMENT_STATUS.PENDING);
                } else if (data.data.status == PAYMENT_STATUS.FAILED) {
                  sendUsingSocket({
                    type: "payment",
                    status: "failed",
                  });
                  setPaymentStatus(PAYMENT_STATUS.FAILED);
                }
              }
            }
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
      .catch((error) => {
        console.log("Error in creating order", error);
      })
      .finally(() => {
        setIsProcessing(false);
        onClose();
      });
  };
  useEffect(() => {
    if (paymentStatus == PAYMENT_STATUS.COMPLETED) {
      mixpanel.track("purchase", {
        page_referrer: document.referrer,
        payment_type: "Gold Payment",
      });
    } else if (paymentStatus == PAYMENT_STATUS.FAILED) {
      mixpanel.track("exit_form", {
        page_referrer: document.referrer,
        payment_type: "Gold Payment",
      });
    }
  }, [paymentStatus]);

  const isLoading = form.formState.isSubmitting;

  return (
    <Modal
      isOpen={isOpen}
      closeModal={onClose}
      className="border-none !max-w-md"
    >
      {(paymentStatus == PAYMENT_STATUS.COMPLETED && (
        <div className="flex flex-col justify-center items-center text-center h-full">
          <span>
            <XMarkIcon
              className="w-8 h-8 cursor-pointer absolute top-5 right-5"
              onClick={onClose}
            />
          </span>
          <CheckCircleIcon className="w-20 h-20 text-green-500 mb-3 mx-auto ring-2 ring-green-400/50 rounded-full" />
          <p>
            <b>PAYMENT SUCCESSFUL</b>
          </p>
          <p>
            Thank you for your payment. Our program manager will contact you
            with further details.
          </p>
        </div>
      )) || (
        <div>
          <div className="flex items-center justify-between">
            <Dialog.Title as="h3" className="text-lg font-medium leading-6">
              {(!isLoading && `${bucket?.title}`) || "Loading"}
            </Dialog.Title>
            <span>
              <XMarkIcon className="w-5 h-5 cursor-pointer" onClick={onClose} />
            </span>
          </div>
          {!isLoading && (
            <Form {...form}>
              <form
                className="flex flex-col gap-3 w-full md:px-3 md:pb-3 mt-2"
                onSubmit={form.handleSubmit(submitForm)}
                id="form"
              >
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="normal-case">
                        Name <sup className="text-red-500">*</sup>{" "}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your name"
                          type="text"
                          disabled={isLoading}
                          className="!rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="normal-case">
                        Email <sup className="text-red-500">*</sup>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your email"
                          type="text"
                          disabled={isLoading}
                          className="!rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="normal-case">
                        Mobile Number <sup className="text-red-500">*</sup>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your mobile number"
                          type="text"
                          disabled={isLoading}
                          className="!rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <button
                    disabled={isProcessing}
                    type="submit"
                    className="mt-3 w-full bg-black black-pulse-button h-12 !text-transparent !tracking-wider !text-2xl"
                  >
                    <span className="bg-gradient-to-r from-[#eec883] via-[rgb(255,234,196)] to-[#eec883] bg-clip-text font-bold text-transparent text-xl text-center tracking-[0] leading-[22.8px] whitespace-nowrap">
                      {bucket?.cta}
                    </span>
                  </button>
                  <p className="text-xs p-2 text-gray-500">
                    *You&apos;re eligible for a full refund upon canceling at
                    least 14 days before the class begins.
                  </p>
                </div>
              </form>
            </Form>
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
    </Modal>
  );
}