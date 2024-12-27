import axios from "axios";
import mixpanel from "@/utils/mixpanel"
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Input } from "@/components/form";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import JoinWhatsAppModal from "../JoinWhatsappModal";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

type Inputs = {
  name: string;
  email: string;
  phone: string;
};

export default function LeadShortFreeForm({
  className,
  masterClass,
  onClick,
  buttonStyle,
  inputStyle,
  customFlow = false,
}: {
  className?: string;
  masterClass: any;
  onClick?: any;
  buttonStyle?: string;
  inputStyle?: string;
  customFlow?: boolean;
}) {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showJoiningPopup, setShowJoiningPopup] = useState(false);

  useEffect(() => {
    if (Object.keys(userData).length != 0) {
      localStorage.setItem("tfu-user-auth", JSON.stringify(userData));
    }
  }, [userData]);
  const pathName = usePathname();
  const redirectionUrl = redirectionBuilder(pathName as string);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const router = useRouter();

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

  const submitForm = (data: Inputs) => {
    setLoading(true);
    const { name, email, phone } = data;

    setUserData({
      name: name,
      phone: phone,
      email: email,
    });
    mixpanel.alias(phone);
    mixpanel.people.set({
      $name: name,
      $email: email,
      $phone: phone,
    });
    mixpanel.identify(phone);

    if (name && email && phone) {

      axios
        .post(`${process.env.NEXT_PUBLIC_BASE_API}leads`, {
          email,
          phone,
          name,
          source: router.query.source || "direct",
          comment: router.query.comment || "",
          masterclassSlotId: slotInfo.id,
          masterclassId: masterClass.id,
        })
        .then((res) => {
          const inputs = [{ name: "email", value: data.email }]
          const tagPayload = {
            event: "contactFormSubmitted",
            formId: 1,
            "gtm.uniqueEventId": Math.floor(Math.random() * 1000),
            inputs
          }
          mixpanel.track("lead_submit", {
            source: router.query.source || "direct",
            comment: router.query.comment || "no_comment",
            type: "free",
            masterclassId: masterClass.id
          })
          const customEvent = new CustomEvent("lead_form_submitted", {
            detail: {
              masterclassSlotId: slotInfo.id,
              masterclassId: masterClass.id,
            },
          });
          document.dispatchEvent(customEvent);
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: "lead_form_submitted" });
          window.dataLayer.push(tagPayload);
          //@ts-ignore
          gtag("event", "contactFormSubmitted", tagPayload);
          if (customFlow) {
            router.push(redirectionUrl);
          } else { setShowJoiningPopup(true); }
          setLoading(false);
          reset();
        });
    }
  };

  return (
    <div className={`${className} relative md:min-w-[450px]`}>
      <JoinWhatsAppModal
        isOpen={showJoiningPopup}
        onClose={() => setShowJoiningPopup(false)}
        joiningLink={activeWAGroup}
        masterclass={masterClass}
      />
      <form
        onSubmit={handleSubmit(submitForm)}
        onClick={onClick}
        className="md:py-5 pt-2"
      >
        <h3 className="text-lg font-semibold mb-3 text-center mt-3">
          Please Enter Your Details
        </h3>
        <div className="mb-3"
          onClick={() => {
            mixpanel.track("marketing_form", {
              input: "Name Edited",
              type: "free"
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
          />
        </div>

        <div className="mb-3"
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
            placeholder="Enter your email"
            register={register}
            errors={errors}
            rules={{ required: true }}
            className={inputStyle}
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
            label="Phone Number"
            placeholder="Enter your phone number"
            register={register}
            errors={errors}
            rules={{ required: true }}
            className={inputStyle}
          />
        </div>

        <div className="w-full flex-col items-center justify-center relative max-md:mb-6">
          <button
            className={`!text-white ${buttonStyle ? buttonStyle + " " + "relative" : `btn-block btn-pill mt-3 btn-dark relative`
              }`}
            type="submit"
          >
            <div className="absolute inset-0 bg-[linear-gradient(110deg,#00000000,45%,#ffffff80,55%,#00000000)] bg-[length:200%_100%] animate-shimmer rounded-md" />
            {loading ? "Loading..." : "Register Now for Free"}
          </button>
          <div className="absolute mt-1 left-44 hidden md:flex">
            <GreenArrow width={25} />
            <p className="text-xs ml-1 rotate-3 mt-5">
              <b>7,000+</b> People Rated My Programs with <b> 4.9 Rating</b>
            </p>
          </div>
        </div>
      </form>
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


function redirectionBuilder(pathName: string): string {
  const arr = pathName?.split('/');
  arr.pop();
  arr.push("redirect");
  arr.push("thanks-free");
  const redirectionUrl = arr.join('/');
  return redirectionUrl;
}