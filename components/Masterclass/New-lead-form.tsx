import { ClockIcon } from "@heroicons/react/24/outline";
import { CalendarIcon, StarIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import { TimerOnlyText } from "../pages/timer/timer";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import JoinWhatsAppModal from "./JoinWhatsappModal";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import webengage from "@/webengage";
import mixpanel from "@/utils/mixpanel";
import Image from "next/image";
import { Check } from "lucide-react";

export const registrationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number should be of 10 digits" })
    .max(10, { message: "Phone number should be of 10 digits" })
    .refine((value) => /^\d+$/.test(value), {
      message: "Phone number should contain only numbers",
    }),
  consent: z.boolean().optional(),
});

export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  const timeouts: { [key: string]: NodeJS.Timeout } = {};
  const lastRun: { [key: string]: number } = {};

  return (...args: Parameters<T>) => {
    const key = args[0] as string; // Assuming the first argument is the field name
    const now = Date.now();

    if (!lastRun[key] || now - lastRun[key] >= limit) {
      func(...args);
      lastRun[key] = now;
    } else {
      clearTimeout(timeouts[key]);
      timeouts[key] = setTimeout(() => {
        if (now - lastRun[key] >= limit) {
          func(...args);
          lastRun[key] = now;
        }
      }, limit - (now - lastRun[key]));
    }
  };
}

export default function NewLeadForm({
  data,
  scroll,
  offerEndTime,
}: {
  data: any;
  scroll: boolean;
  offerEndTime: any;
}) {
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      consent: false,
    },
  });

  const router = useRouter();
  const [userData, setUserData] = useState({});
  const [showJoiningPopup, setShowJoiningPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(userData).length != 0) {
      localStorage.setItem("tfu-user-auth", JSON.stringify(userData));
    }
  }, [userData]);

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

  const submitForm = (input: z.infer<typeof registrationSchema>) => {
    const { name, email, phone, consent } = input;

    setUserData({
      name: input.name,
      phone: input.phone,
      email: input.email,
    });

    mixpanel.alias(input?.phone);
    mixpanel.people.set({
      $name: input?.name,
      $email: input?.email,
      $phone: input?.phone,
    });
    mixpanel.identify(input?.phone);
    mixpanel.track("register_now", {
      masterclass: data?.masterClass?.title,
      user: userData,
    });

    const _webengage = webengage();
    if (_webengage && data) {
      _webengage.user.login(input.phone);
      _webengage.user.setAttribute("we_email", input.email);
      _webengage.user.setAttribute("we_phone", input.phone);
      _webengage.user.setAttribute("we_first_name", name);
      _webengage.track("Submit Lead", {
        title: data?.masterClass?.bootcamp?.title,
        category: data?.masterClass?.bootcamp?.teacher?.category?.name,
        price: "free",
        teacher: data?.masterClass?.bootcamp?.teacher.name,
        date: data?.startDateTime && new Date(data?.startDateTime),
        source: "Tradewise",
      });
    }

    if (name && email && phone) {
      setIsLoading(true);
      axios
        .post(`${process.env.NEXT_PUBLIC_BASE_API}leads`, {
          email,
          phone,
          name,
          consent,
          source: router.query.source || "direct",
          comment: router.query.comment || "",
          masterclassSlotId: data?.id,
          masterclassId: data?.masterClassId,
        })
        .then((res) => {
          const info = localStorage["tfu-user-auth"]
            ? JSON.parse(localStorage["tfu-user-auth"])
            : null;
          form.reset();
          setShowJoiningPopup(true);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const rating = data?.masterClass?.bootcamp?.teacher?.achievements?.rating; //rating
  const students = data?.masterClass?.bootcamp?.teacher?.achievements?.students; //students taught
  const starArray = [1, 2, 3, 4, 5];

  const throttledTrackFormEdit = useCallback(
    throttle((field: string) => {
      const _webengage = webengage();
      if (_webengage) {
        _webengage.track("bootcamp form edited", {
          title: data.masterClass.title,
          category: data.masterClass?.bootcamp?.teacher?.category?.name,
          price: "free",
          teacher: data.masterClass?.bootcamp?.teacher.name,
          date: data?.startDateTime && new Date(data?.startDateTime),
          source: "Tradewise",
          field: field,
        });
      }
    }, 5000),
    [data]
  );

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name) {
        throttledTrackFormEdit(name);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [form, throttledTrackFormEdit]);

  return (
    <React.Fragment>
      {/* webiste view */}
      <div className="flex flex-col gap-2 w-full justify-center items-start select-none font-inter max-md:hidden">
        <JoinWhatsAppModal
          isOpen={showJoiningPopup}
          onClose={() => {
            setShowJoiningPopup(false);
            mixpanel.track("ignore_whatsapp", {
              masterclass: data?.masterClass?.title,
            });
          }}
          joiningLink={data?.whatsappGroupLink}
          masterclass={data?.masterClass}
        />
        <h3 className="text-[#002082] md:hidden">{data?.masterClass?.title}</h3>

        <div className="flex flex-col gap-4 w-full font-medium">
          <div className="flex flex-col gap-3 w-full font-medium px-3 max-lg:px-1">
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-row gap-1 justify-start items-center">
                <p className="text-[#FF7426] font-semibold text-[24px]">Free</p>
                <div className="text-[#8C94A3] md:text-sm line-through">
                  ₹499
                </div>
              </div>
              <div className="bg-[#FF663620] px-2">
                <small className="text-[#FF6636]">100% OFF</small>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-row gap-1 text-xs items-center">
                <Image
                  src="/tradewise/red-alarm.svg"
                  width={16}
                  height={16}
                  alt="alarm icon"
                />
                <p className="text-[#E34444]">Offer Ends in:</p>
                <TimerOnlyText
                  tillDateTime={offerEndTime}
                  className="text-[#E34444] font-semibold"
                />
              </div>
              <div className="flex flex-row max-lg:flex-col justify-center gap-1">
                <div className="flex flex-row justify-center items-center">
                  {rating
                    ? starArray.map((stars: number, index: number) => {
                        if (stars <= rating) {
                          return (
                            <StarIcon
                              key={index}
                              className="w-4 h-4 text-[#FFA135]"
                            />
                          );
                        } else {
                          return (
                            <StarIcon
                              key={index}
                              className="w-4 h-4 text-[#F9D4AB]"
                            />
                          );
                        }
                      })
                    : starArray.map((stars: number, index: number) => {
                        return (
                          <StarIcon
                            key={index}
                            className="w-4 h-4 text-[#FFA135]"
                          />
                        );
                      })}
                </div>
                <p className="text-[#606060] text-xs">
                  {rating ? rating : 5} (
                  {parseInt(students) > 1000
                    ? `${Math.floor(parseInt(students) / 1000)}k+`
                    : "10k+"}
                  )
                </p>
              </div>
            </div>
          </div>
          <div className="border-t-2 border-[#ACACAC48] border-dotted w-full"></div>

          <div className="flex flex-col gap-3 w-full font-medium px-3 max-lg:px-1">
            <div className="flex flex-row justify-between items-center w-full text-xs">
              <div className="flex flex-row justify-center items-center gap-1">
                <CalendarIcon className="w-5 h-5" color="#6E7485" />
                <p className="text-[#1D2026]">Upcoming Class:</p>
              </div>
              <p className="text-[#6E7485]">
                {dayjs(data?.startDateTime)?.format("DD MMMM")} (
                {dayjs(data?.startDateTime)?.format("dddd")})
              </p>
            </div>
            <div className="flex flex-row justify-between items-center w-full text-xs">
              <div className="flex flex-row justify-center items-center gap-1">
                <ClockIcon className="w-5 h-5" color="#6E7485" />
                <p className="text-[#1D2026]">Class Time:</p>
              </div>
              <p className="text-[#6E7485]">
                {dayjs(data?.startDateTime)?.format("hh:mm A")}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t-2 border-[#ACACAC48] border-dotted w-full"></div>
        {/*form */}
        <p className="text-[#002082] font-semibold px-3 max-lg:px-1">
          Please enter your details
        </p>

        <Form {...form}>
          <form
            className="flex flex-col gap-3 px-3 max-lg:px-1 pb-3 mt-2"
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
                      className="!rounded"
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
                      className="!rounded"
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
                      className="!rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="consent"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex w-full items-center gap-2">
                  <FormControl className="w-4 h-4">
                    <div
                      onClick={() => field.onChange(!field.value)}
                      className={`cursor-pointer w-4 h-4 flex items-center justify-center border-2 rounded ${
                        field.value
                          ? "bg-foreground border-foreground"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="hidden"
                      />
                      {field.value && <Check color="white" />}
                    </div>
                  </FormControl>
                  <FormLabel className="normal-case w-[97%] text-xs font-normal">
                    I authorize Tradewise to reach out to me with updates and
                    notifications via Email, SMS, WhatsApp and RCS.
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              disabled={isLoading}
              className="bg-[#0A2133] !text-white border-none w-full h-12 rounded-sm mt-2"
              type="submit"
            >
              {isLoading ? "Registering..." : "Register Now"}
            </button>
          </form>
        </Form>
      </div>

      {/*mobile view */}
      <div className="flex flex-col justify-start gap-2 w-full mt-3 md:hidden">
        <JoinWhatsAppModal
          isOpen={showJoiningPopup}
          onClose={() => setShowJoiningPopup(false)}
          joiningLink={data?.whatsappGroupLink}
          masterclass={data?.masterClass}
        />
        <h3 className="text-[#002082] md:hidden">{data?.masterClass?.title}</h3>
        <Image
          src={
            data?.masterClass?.bootcamp?.coverImage ||
            "/fallback-thumbnail.webp"
          }
          width={980}
          height={560}
          alt="bootcamp thumbnail"
          className="rounded-lg shadow-[0_0px_6px_-3px_rgba(0,0,0,0.3)]"
        />
        <div className="flex flex-col gap-2 w-full md:px-3 font-medium">
          <div className="flex flex-row justify-between items-center w-full md:text-sm">
            <div className="flex flex-row justify-center items-center gap-1">
              <CalendarIcon className="w-5 h-5" />
              <p className="text-[#606060]">
                {dayjs(data?.startDateTime)?.format("DD MMMM")} (
                {dayjs(data?.startDateTime)?.format("dddd")})
              </p>
            </div>
            <div className="flex flex-row justify-center items-center gap-1">
              <ClockIcon className="w-5 h-5" />
              <p className="text-[#606060]">
                {dayjs(data?.startDateTime)?.format("hh:mm A")}
              </p>
            </div>
          </div>
          <div className="border-t-2 border-[#ACACAC] border-dotted w-full"></div>
          <div className="flex flex-row justify-between items-center w-full md:hidden">
            <p className="text-[#606060]">Intraday Trading</p>
            <div className="flex flex-row justify-center gap-1">
              <div className="flex flex-row justify-center items-center">
                {rating
                  ? starArray.map((stars: number, index: number) => {
                      if (stars <= rating) {
                        return (
                          <StarIcon
                            key={index}
                            className="w-5 h-5 text-[#FFA135]"
                          />
                        );
                      } else {
                        return (
                          <StarIcon
                            key={index}
                            className="w-5 h-5 text-[#F9D4AB]"
                          />
                        );
                      }
                    })
                  : starArray.map((stars: number, index: number) => {
                      return (
                        <StarIcon
                          key={index}
                          className="w-5 h-5 text-[#FFA135]"
                        />
                      );
                    })}
              </div>
              <p className="text-[#606060]">
                {rating ? rating : 5} (
                {parseInt(students) > 1000
                  ? `${Math.floor(parseInt(students) / 1000)}k+`
                  : "10k+"}
                )
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-row gap-1 justify-start items-center">
              <h4 className="text-[#FF7426] font-semibold md:text-sm">Free</h4>
              <div className="text-[#0A2133] md:text-sm line-through">₹499</div>
            </div>
            <div className="flex flex-row gap-1 md:text-sm">
              <p className="text-[#0A2133]">Offer Ends in:</p>
              <TimerOnlyText
                tillDateTime={offerEndTime}
                className="text-[#FF7426] font-semibold"
              />
            </div>
          </div>
        </div>
        {/*form */}
        <h3 className="text-[#002082] md:hidden">Please enter your details</h3>
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
                      className="!rounded"
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
                      className="!rounded"
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
                      className="!rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="consent"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex w-full items-center gap-2">
                  <FormControl className="w-4 h-4">
                    <div
                      onClick={() => field.onChange(!field.value)}
                      className={`cursor-pointer w-4 h-4 flex items-center justify-center border-2 rounded ${
                        field.value
                          ? "bg-foreground border-foreground"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="hidden"
                      />
                      {field.value && <Check color="white" />}
                    </div>
                  </FormControl>
                  <FormLabel className="normal-case w-[97%] text-xs font-normal">
                    I authorize Tradewise to reach out to me with updates and
                    notifications via Email, SMS, WhatsApp and RCS.
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              disabled={isLoading}
              className="bg-[#0A2133] !text-white border-none w-full h-12 rounded"
              type="submit"
            >
              {isLoading ? "Registering..." : "Register Now"}
            </button>
          </form>
        </Form>
      </div>
    </React.Fragment>
  );
}
