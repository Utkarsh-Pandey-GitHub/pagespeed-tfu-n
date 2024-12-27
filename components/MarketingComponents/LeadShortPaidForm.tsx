import axios from "axios";
import mixpanel from "@/utils/mixpanel";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Input } from "@/components/form";
import { useEffect, useState } from "react";
import tradwiseIcon from "@/marketingUtils/tradeWiseIcon"
import BumpOfferModal from "./bump-offer-component/BumpOfferModal";



declare global {
  interface Window {
    dataLayer: any[];
  }
}

enum paymentTockens {
  FACEBOOK =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbW91bnQiOjk5fQ.4Ln6tNDxvsLnO_jvL1_pFoRzaEPiaaa5Mxus3KKJEA8",
  GOOGLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbW91bnQiOjQ5fQ.CxV6Wx22zOtz70T6JXG79RZVCpx5ygSqUTgSf-eNwsA",
  CUSTOM = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbW91bnQiOjE5OX0.PuzNQ0M-j_JtLU2YKhkEsmXTjHAfx-L389zz-5UhgcY"
};

type Inputs = {
  name: string;
  email: string;
  phone: string;
};

export default function LeadShortPaidForm({
  className,
  masterClass,
  onClick,
  buttonStyle,
  shortPage = false,
  inputStyle,
  amount,
  backComment,
  source,
  leadComment,
  customToken,
  fullDomain,
  masterClassId,
  isBumpOffer = false,
  bumpOfferArray,
  abTestCounter,
  slug,
  abTestType,
  pageDesc,
}: {
  className?: string;
  masterClass: any;
  onClick?: any;
  buttonStyle?: string;
  shortPage?: boolean;
  inputStyle?: string;
  amount: number
  backComment: string
  source: string
  leadComment: string
  customToken?: string
  fullDomain: string
  masterClassId: string
  isBumpOffer?: boolean
  bumpOfferArray?: any[]
  abTestCounter?: number
  slug?: string
  abTestType?: string
  pageDesc?: string
}) {
  const [userData, setUserData] = useState({});
  
  const [loading, setLoading] = useState(false);
  const [userIp, setUserIp] = useState("");

  

  useEffect(() => {
    axios.get("https://api.ipify.org/?format=json").then((res) =>
      setUserIp(res.data.ip))
  }, [])

  useEffect(() => {
    if (Object.keys(userData).length != 0) {
      localStorage.setItem("tfu-user-auth", JSON.stringify(userData));
    }
  }, [userData]);

  const {
    register,
    handleSubmit,
    watch,
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

  const slotInfo = masterClass?.slots?.find(
    (singleSlot: any) => singleSlot.active === true
  );

  const activeWAGroup = slotInfo?.whatsappGroupLink;

  const redirectURL = `${fullDomain}/${masterClassId}/redirect/thanks-paid`;

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
  const bucket = abTestCounter ? (abTestCounter % 10 == 1 || abTestCounter % 10 == 2 ? "Exp" : "Control") : "";
  const leadHandler = (data: Inputs) => {
    const { name, email, phone } = data;
    setUserData({
      name: data.name,
      phone: data.phone,
      email: data.email,
    });

    if (name && email && phone) {
      mixpanel.alias(phone);
      mixpanel.people.set({
        $name: name,
        $email: email,
        $phone: phone,
      });
      mixpanel.identify(phone);

      axios
        .post(`${process.env.NEXT_PUBLIC_BASE_API}leads`, {
          email,
          phone,
          name,
          source: "direct",
          comment:  "",
          masterclassSlotId: slotInfo.id,
          masterclassId: masterClass.id,
          ...(bucket && abTestType && {
            payload: {
              bucket,
              pageDesc,
              abTestType,
            },
          }),
        })
        .then((res) => {
          const inputs = [{ name: "email", value: data.email }]
          const tagPayload = {
            event: "contactFormSubmitted",
            formId: 2,
            "gtm.uniqueEventId": Math.floor(Math.random() * 1000),
            inputs
          }
          mixpanel.track("lead_submit", {
            source: "direct",
            comment: "no_comment",
            type: "paid",
            masterclassId: masterClassId
          })
          const customEvent = new CustomEvent("lead_form_submitted_paid", {
            detail: {
              masterclassSlotId: slotInfo.id,
              masterclassId: masterClass.id,
            },
          });
          document.dispatchEvent(customEvent);
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: "lead_form_submitted_paid" });
          window.dataLayer.push(tagPayload);
          //@ts-ignore
          gtag("event", "contactFormSubmitted", tagPayload);
          reset();
        })
        .catch((err) => {
          console.error(err);
        })
    }
  }
  const paymentHandler = (data: Inputs, bumpToken?: any, selectedOffers?: any, totalPrice?: any) => {
    if (!data.name || !data.email || !data.phone) return;
    const { name, email, phone } = data;
    const mixpanelData = {
      source: source,
      paymentStage: "razorpay_init",
      payment_type: "discounted",
      masterClassId: masterClass?.id,
      platform: "tradewise"
    };
    const options = {
      masterClassId: masterClass?.id || "",
      name: name,
      phone: phone,
      email: email,
      paymentMethodType: backComment,
      userIp: userIp,
      comment: leadComment,
      origin: window.location.href,
      token:
        bumpToken ? bumpToken : (customToken ? customToken : source === "facebook" ? paymentTockens.FACEBOOK : paymentTockens.GOOGLE),

    };
    setLoading(true);
    mixpanel.track("payment_initiate", mixpanelData);
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
          name: `Masterclass: ${masterClass?.title}`,
          description:
            masterClass?.metaData?.workshopTitle || masterClass.title,
          image: tradwiseIcon,
          handler: async function (response: any) {
            mixpanel.track("purchase", {
              page_referrer: document.referrer,
              platform: "tradewise",
              amount: amount,
              masterClassId: masterClass?.id
            })
            if (selectedOffers) {
              setIsBumpModalOpen(false)
              await exportToBumpExcel(data, selectedOffers, totalPrice, source, backComment);
            }
            window.location.href =
              redirectURL || activeWAGroup || "https://tradewiseapp.com/";
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
        setLoading(false);
      });
  }
  const submitForm = (data: Inputs, bumpToken?: any, selectedOffers?: any, totalPrice?: any) => {
    setLoading(true);

    const { name, email, phone } = data;

    setUserData({
      name: data.name,
      phone: data.phone,
      email: data.email,
    });

    const mixpanelData = {
      source: source,
      paymentStage: "razorpay_init",
      payment_type: "discounted",
      masterClassId: masterClass?.id,
      platform: "tradewise"
    };

    if (name && email && phone) {
      mixpanel.alias(phone);
      mixpanel.people.set({
        $name: name,
        $email: email,
        $phone: phone,
      });
      mixpanel.identify(phone);

      axios
        .post(`${process.env.NEXT_PUBLIC_BASE_API}leads`, {
          email,
          phone,
          name,
          source:  "direct",
          comment:  "",
          masterclassSlotId: slotInfo.id,
          masterclassId: masterClass.id,
          ...(bucket && abTestType && {
            payload: {
              bucket,
              pageDesc,
              abTestType,
            }
          })
        })
        .then((res) => {
          const inputs = [{ name: "email", value: data.email }]
          const tagPayload = {
            event: "contactFormSubmitted",
            formId: 2,
            "gtm.uniqueEventId": Math.floor(Math.random() * 1000),
            inputs
          }
          mixpanel.track("lead_submit", {
            source:  "direct",
            comment:  "no_comment",
            type: "paid",
            masterclassId: masterClassId
          })
          const customEvent = new CustomEvent("lead_form_submitted_paid", {
            detail: {
              masterclassSlotId: slotInfo.id,
              masterclassId: masterClass.id,
            },
          });
          document.dispatchEvent(customEvent);
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: "lead_form_submitted_paid" });
          window.dataLayer.push(tagPayload);
          //@ts-ignore
          gtag("event", "contactFormSubmitted", tagPayload);
          reset();
          const options = {
            masterClassId: masterClass?.id || "",
            name: data.name,
            phone: data.phone,
            email: data.email,
            paymentMethodType: backComment,
            userIp: userIp,
            comment: leadComment,
            origin: window.location.href,
            token:
              bumpToken ? bumpToken : (customToken ? customToken : source === "facebook" ? paymentTockens.FACEBOOK : paymentTockens.GOOGLE),
          };
          mixpanel.track("payment_initiate", mixpanelData);

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
                name: `Masterclass: ${masterClass?.title}`,
                description:
                  masterClass?.metaData?.workshopTitle || masterClass.title,
                image: tradwiseIcon,
                handler: async function (response: any) {
                  mixpanel.track("purchase", {
                    page_referrer: document.referrer,
                    platform: "tradewise",
                    amount: amount,
                    masterClassId: masterClass?.id
                  })
                  if (selectedOffers) {
                    setIsBumpModalOpen(false)
                    await exportToBumpExcel(data, selectedOffers, totalPrice, source, backComment);
                  }
                  window.location.href =
                    redirectURL || activeWAGroup || "https://tradewiseapp.com/";
                },
                order_id: gatewayOrderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                theme: {
                  color: "#000",
                },
              };

              // @ts-ignore
              const rzp1 = new window.Razorpay(options);
              setLoading(false);
              rzp1.open();
            })
            .catch((err) => {
              console.error(err);
              setLoading(false);
            })
            .finally(() => {
              setLoading(false);
            });
        })
    }
  }
  const [isBumpModalOpen, setIsBumpModalOpen] = useState(false);
  const handleClick = (data: Inputs) => {
    if (isBumpOffer) {
      setIsBumpModalOpen(true);
      leadHandler(data);
    }
    else {
      submitForm(data);
    }
  }

  return (
    <div className={`${className} relative md:min-w-[450px]`}>
      <form
        onSubmit={handleSubmit(handleClick)}
        onClick={onClick}
        className="md:py-5 pt-2"
      >
        <h3 className="text-lg font-semibold mb-3 text-center mt-3">
          Please Enter Your Details
        </h3>
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
            type="text"
            name="name"
            label="Name"
            placeholder="Enter your name"
            register={register}
            errors={errors}
            rules={{ required: true }}
            className={inputStyle}
            {...(shortPage && { labelDisabled: true })}
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
            placeholder="Enter your email"
            register={register}
            errors={errors}
            rules={{ required: true }}
            className={inputStyle}
            {...(shortPage && { labelDisabled: true })}
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
            label="Phone Number"
            placeholder="Enter your phone number"
            register={register}
            errors={errors}
            rules={{ required: true }}
            className={inputStyle}
            {...(shortPage && { labelDisabled: true })}
          />
        </div>

        <div className="w-full flex-col items-center justify-center relative max-md:mb-6">
          <button
            className={
              `!text-white rounded-md w-full ${buttonStyle ? buttonStyle + " " + "relative" : `btn-block btn-pill mt-3 btn-dark relative`}`
            }
            type="submit"
          >
            <div className="absolute inset-0 bg-[linear-gradient(110deg,#00000000,45%,#ffffff80,55%,#00000000)] bg-[length:200%_100%] animate-shimmer rounded-md" />
            {loading ? "Loading..." : `Register Now For ₹${amount}`}
          </button>
          <div className="absolute mt-1 left-44 hidden md:flex">
            <GreenArrow width={25} />
            <p className="text-xs ml-1 rotate-3 mt-5"><b>7,000+</b> People Rated My Programs with <b> 4.9 Rating</b></p>
          </div>

        </div>
      </form>
      <BumpOfferModal
        isOpen={isBumpModalOpen}
        setIsOpen={setIsBumpModalOpen}
        onClose={paymentHandler}
        data={userData}
        loading={loading}
        token={amount == 49 ? paymentTockens.GOOGLE : amount == 99 ? paymentTockens.FACEBOOK : customToken}
        bumpOffers={bumpOfferArray}
        basePrice={amount}
      />
    </div>
  );
}


const GreenArrow = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      width="40"
      height="37"
      viewBox="0 0 40 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M29.0004 33.3025L29.1677 32.2153L29.1646 32.2148L29.0004 33.3025ZM8.74828 1.99593C8.30281 1.58285 7.60683 1.60911 7.19376 2.05459L0.462355 9.31394C0.0492829 9.75941 0.0755465 10.4554 0.521017 10.8684C0.966487 11.2815 1.66247 11.2553 
        2.07554 10.8098L8.05901 4.35705L14.5118 10.3405C14.9573 10.7536 15.6533 10.7273 16.0663 10.2819C16.4794 9.83639 16.4532 9.1404 16.0077 8.72733L8.74828 1.99593ZM35.5004 34.3025L35.333 35.3898L35.3447 35.3914L35.5004 34.3025ZM29.1646 
        32.2148C24.9947 31.5854 20.1921 29.3847 16.3296 24.7943C12.4709 20.2084 9.49223 13.1665 9.09957 2.76104L6.90113 2.844C7.30847 13.6385 10.4132 21.1799 14.6462 26.2107C18.8754 31.2369 24.1727 33.6863 28.8362 34.3902L29.1646 32.2148ZM28.8331 
        34.3897L35.333 35.3898L35.6677 33.2153L29.1677 32.2153L28.8331 34.3897ZM35.3447 35.3914L38.8447 35.8914L39.156 33.7136L35.656 33.2136L35.3447 35.3914Z"
        fill="#05C148"
      />
    </svg>
  );
};

