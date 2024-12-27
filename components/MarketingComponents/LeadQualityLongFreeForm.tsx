"use client"
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { Input } from "../form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Image from "next/image";
import Link from "next/link";

dayjs.extend(advancedFormat);

const LeadFormSchema = z.object(
  {
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email provided" }),
    phone: z
      .string()
      .min(10, { message: "Phone number should be 10 digits" })
      .max(10, { message: "Phone number should be 10 digits" })
      .refine((value) => /^\d+$/.test(value), {
        message: "Phone number should contain only numbers",
      })
      .refine((value) => /^(6|7|8|9)\d{9}$/.test(value), {
        message: "Phone number should be a valid Indian number",
      }),
  }
)

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

export function
  LeadQualityForm({
    className,
    masterClass,
    onClick,
    buttonStyle,
    inputStyle,
    customPage = false,
    exportToExcel,
    setQualityFormStep = () => { },
    setUserStep1Data = () => { }
  }: {
    className?: string;
    masterClass: any;
    onClick?: any;
    buttonStyle?: string;
    inputStyle?: string;
    customPage?: boolean;
    exportToExcel?: any
    setQualityFormStep?: any
    setUserStep1Data?: any
  }) {
  const [showJoiningPopup, setShowJoiningPopup] = useState(false);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

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
  } = useForm<Inputs>({
    resolver: zodResolver(LeadFormSchema),
  });

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

  const submitForm = (data: Inputs) => {
    const { name, email, phone } = data;

    setUserData({
      name: data.name,
      phone: data.phone,
      email: data.email,
    });

    setLoading(true);
    setQualityFormStep(2);
    setUserStep1Data({
      name: data.name,
      phone: data.phone,
      email: data.email
    });
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
        const customEvent = new CustomEvent("Free_Lead_Form_Submitted", {
          detail: {
            masterclassSlotId: slotInfo.id,
            masterclassId: masterClass.id,
            tagPayload
          },
        });
        document.dispatchEvent(customEvent);
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "Free_Lead_Form_Submitted" });
        window.dataLayer.push(tagPayload);
        //@ts-ignore
        gtag("event", "contactFormSubmitted", tagPayload);
        reset();
        setShowJoiningPopup(true);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const activeSlot = masterClass?.slots?.find((slot: any) => {
    return slot.active == true;
  });

  return (
    <div className={`${className} relative p-2 `}>

      <div
        className=" bg-cover bg-center"
        style={{
          backgroundImage: `url(${masterClass?.bootcamp?.coverImage})`,
        }}
      ></div>
      <form
        onSubmit={handleSubmit(submitForm)}
        onClick={onClick}
        className="md:py-5 pt-2"
      >
        {slotInfo && !customPage && (
          <div className="text-sm md:p-4 p-2 rounded-lg bg-green-200 border border-green-300 flex items-center gap-2">
            <span>
              <InformationCircleIcon className="w-5 h-5 stroke-[2]" />
            </span>
            <span>
              Upcoming masterclass is on{" "}
              <span className="font-semibold">
                {dayjs(slotInfo.startDateTime).format("Do MMM (dddd)")}
              </span>{" "}
              at{" "}
              <span className="font-semibold">
                {dayjs(slotInfo.startDateTime).format("h:mm A")}
              </span>
            </span>
          </div>
        )}
        <h3 className="md:text-lg text-sm font-semibold md:mb-3 text-center md:mt-3 mt-1 mb-1 ">
          Please Enter Your Details
        </h3>
        <div
          className="mb-3"
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

        <div
          className="mb-3"
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

        <div className="w-full flex items-center justify-center">
          <button
            className={
              buttonStyle ? buttonStyle + " " + "relative" : `btn-block btn-pill mt-3 btn-dark relative`
            }
            type="submit"
          >
            <div className="absolute inset-0 bg-[linear-gradient(110deg,#00000000,45%,#ffffff80,55%,#00000000)] bg-[length:200%_100%] animate-shimmer rounded-md" />
            {loading ? "Loading..." : "Register Now For Free"}
          </button>
        </div>
      </form>
    </div>
  );
}




export function LeadQualityFormStep2({
  masterClass,
  className,
  onClick,
  buttonStyle,
  inputStyle,
  userStep1Data = {},
  questionsData,
}: {
  masterClass?: any,
  className?: string,
  onClick?: any;
  buttonStyle?: string;
  inputStyle?: string;
  userStep1Data: any;
  questionsData: any[];
}) {



  const slotInfo = masterClass?.slots?.find(
    (singleSlot: any) => singleSlot.active === true
  );
  const [formData, setFormData] = useState({
    question1: '',
    question2: '',
    question3: '',
    question4: ''
  });
  const router = useRouter();
  async function exportToExcel() {
    const formdata = new FormData();
    formdata.append('platform', '2step-tradewise');
    formdata.append('name', userStep1Data.name);
    formdata.append('phone', userStep1Data.phone);
    formdata.append('email', userStep1Data.email);
    formdata.append('option1', formData.question1);
    formdata.append('option2', formData.question2);
    formdata.append('option3', formData.question3);
    formdata.append('source', (router.query.source || "direct") as string);
    formdata.append('comment', (router.query.comment || "default_comment") as string);
    try {
      await axios.post(process.env.NEXT_PUBLIC_GOOGLE_SHEET_TICK_OPTIONS!, formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    }
    catch (error) {
      console.error(error);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!name) return;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const customEvent = new CustomEvent("Free_Qualified_Lead", {
      detail: {
        masterclassSlotId: slotInfo.id,
        masterclassId: masterClass.id,
      },
    });
    document.dispatchEvent(customEvent);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "Free_Qualified_Lead" });

    if (slotInfo?.whatsappGroupLink) {
      window.location.href = slotInfo.whatsappGroupLink;
    }
    exportToExcel();

  };

  const activeSlot = masterClass?.slots?.find((slot: any) => {
    return slot.active == true;
  });

  return (
    <div className={`${className}  bg-white  shadow-md  `}>

      <div className="bg-[#253242] !text-white p-2 m-0 " >
        <h1 className="text-2xl font-bold mb-2 text-center">Almost There...
        </h1>
        <div className="text-center">
          Fill in your details to make the most of your webinar spot
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 p-2 flex flex-col gap-2 mt-5 text-xl">
        {questionsData.map(question => (
          <div key={question.label}>
            <p className="block mb-2 text-[18px] font-bold text-gray-700 ">
              {question.question}
            </p>
            <select
              name={question.label}
              value={formData[question.label as keyof typeof formData]}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select an option</option>
              {question.options.map((option: any) => (
                <option key={option} value={option.toLowerCase().replace(/\s+/g, '_')}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button
          type="submit"
          className="btn-block text-xl py-3 mt-10 bg-[#253242] !text-white  active:scale-[101%] "
        >
          Submit & Join Whatsapp Group
        </button>


      </form>
    </div>
  );
}


