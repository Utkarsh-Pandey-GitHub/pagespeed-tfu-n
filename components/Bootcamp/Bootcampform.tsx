import axios from "axios";
import { z } from "zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Summary from "./Summary";
import webengage from "@/webengage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GoldCard from "@/components/gold/Goldcard";
import { BootcampSlugData, UserLocalData } from "@/types/bootcamp-slug";
import SelectCoupon from "@/components/coupons/SelectCoupon";
import { paymentType, purchaseBootcamp } from "@/utils/bootcamp";
import useGetAmount from "@/hooks/getAmount";
import mixpanel from "@/utils/mixpanel";

const BootcampSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string(),
});

export default function BootcampForm({
  bootcamp,
  coupons,
  amount,
}: {
  bootcamp: BootcampSlugData["data"];
  amount: ReturnType<typeof useGetAmount>;
  coupons?: any;
}) {
  const { mainButtonAmount, BaseAmount, isToken, isDiscounted } = amount;
  const [addPlan, setAddPlan] = useState<boolean>(
    bootcamp?.Bootcamp?.metaData?.goldcard === "true" ? true : false
  );
  const [price, setPrice] = useState(
    parseInt(mainButtonAmount, 10) +
      (bootcamp?.Bootcamp?.metaData?.goldcard === "true" ? 999 : 0)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [userIp, setUserIp] = useState("");
  const router = useRouter();
  const [errorMessageSelectCoupons, setErrorMessageSelectCoupons] =
    useState("");
  const [isSelectCouponEnabled, setIsSelectCouponEnabled] =
    useState<boolean>(false);
  const [phoneValidationError, setPhoneValidationError] = useState<string>("");
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [finalCouponSelected, setFinalCouponSelected] =
    useState<any>(undefined);
  const userDetails: UserLocalData | null =
    typeof localStorage !== "undefined"
      ? JSON.parse(String(localStorage.getItem("tfu-user-auth")))
      : null;
  const [phoneNumber, setPhoneNumber] = useState(userDetails?.phone || "");

  const form = useForm<z.infer<typeof BootcampSchema>>({
    resolver: zodResolver(BootcampSchema),
    defaultValues: {
      name: userDetails?.name || "",
      email: userDetails?.email || "",
      phone: userDetails?.phone || "",
    },
  });

  const paymentMethodType = useMemo(() => {
    if (isToken && !addPlan) {
      return paymentType.TOKEN;
    } else if (!isToken && addPlan) {
      return paymentType.GOLD_BOOTCAMP;
    } else if (isDiscounted && !isToken) {
      return paymentType.DISCOUNTED;
    } else if (isToken && addPlan) {
      return paymentType.TOKEN_PLUS_GOLD;
    } else {
      return "";
    }
  }, [isToken, addPlan, isDiscounted]);

  const onSubmit = async (values: z.infer<typeof BootcampSchema>) => {
    if (/^\d+$/.test(phoneNumber) === false) {
      setPhoneValidationError("Phone number should contain only numbers");
      return;
    }
    if (phoneNumber?.length !== 10) {
      setPhoneValidationError("Phone number should be of 10 digits");
      return;
    }
    values.phone = phoneNumber ? phoneNumber : values?.phone;
    localStorage.setItem("tfu-user-auth", JSON.stringify(values));
    setIsLoading(true);

    await purchaseBootcamp({
      values,
      finalCouponSelected,
      bootcamp,
      addPlan,
      router,
      paymentMethodType,
      userIp,
    });
    setIsLoading(false);
  };

  const fetchUserIp = async () => {
    const { data } = await axios.get("https://api64.ipify.org/");
    setUserIp(data);
  };

  useEffect(() => {
    const _webengage = webengage();
    _webengage?.track("Bootcamps viewed", {
      title: bootcamp.Bootcamp?.title,
      industry: bootcamp.Bootcamp?.teacher?.category?.name,
      price: Number(mainButtonAmount),
      teacher: bootcamp.Bootcamp?.teacher.name,
      duration: `${bootcamp.Bootcamp?.duration} ${bootcamp.Bootcamp?.durationType}`,
      source: "Tradewise",
      date: bootcamp?.startDateTime && new Date(bootcamp.startDateTime),
    });
    fetchUserIp();
  }, []);
  const [mobileCoupons, setMobileCoupons] = useState<any>([]);
  useEffect(() => {
    setMobileCoupons(JSON.parse(localStorage.getItem("coupons") ?? "[]"));
  }, [coupons]);

  const handleApplyCouponClick = () => {
    if (phoneNumber?.length !== 10) {
      setErrorMessageSelectCoupons("Please enter a valid phone number first");
      setIsSelectCouponEnabled(false);
      return;
    }
    setIsSelectCouponEnabled(true);
    mixpanel.track("apply_coupon", {
      bootcamp_title: bootcamp?.Bootcamp?.title,
      phone_number: phoneNumber,
      source: "astrolearn",
    });
  };

  const handlePhoneChange = (e: any) => {
    setPhoneNumber(e.target.value);
    if (e.target.value?.length === 10) {
      setErrorMessageSelectCoupons("");
      setIsSelectCouponEnabled(true);
    } else {
      setErrorMessageSelectCoupons("Enter a valid phone number first");
      setIsSelectCouponEnabled(false);
    }
  };

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.addEventListener("click", (e) => {
        if (e.target instanceof HTMLInputElement) {
          const _webengage = webengage();
          if (_webengage) {
            _webengage.track("bootcamp form edited", {
              title: bootcamp.Bootcamp?.title,
              industry: bootcamp.Bootcamp?.teacher?.category?.name,
              price: Number(mainButtonAmount),
              teacher: bootcamp.Bootcamp?.teacher.name,
              duration: `${bootcamp.Bootcamp?.duration} ${bootcamp.Bootcamp?.durationType}`,
              source: "Tradewise",
              date: bootcamp?.startDateTime && new Date(bootcamp.startDateTime),
              field: e.target.name,
            });
          }
        }
      });
    }
  }, [formRef]);

  return (
    <Form {...form}>
      <form
        id="form"
        className="w-full rounded-lg border-2 border-blue-950 sticky top-12"
        onSubmit={form.handleSubmit(onSubmit)}
        ref={formRef}
      >
        <h2 className="text-lg py-2 bg-blue-950 text-white uppercase text-center">
          Registration Form
        </h2>
        <div className="my-4 px-3 space-y-4">
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
                    onClick={() => {
                      mixpanel.track("form_start", {
                        input: "Name edited",
                        bootcamp: bootcamp?.Bootcamp?.title,
                      });
                    }}
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
                    onClick={() => {
                      mixpanel.track("form_start", {
                        input: "Email edited",
                        bootcamp: bootcamp?.Bootcamp?.title,
                      });
                    }}
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
                  Mobile Number (Whatsapp) <sup className="text-red-500">*</sup>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your whatsapp number"
                    type="text"
                    disabled={isLoading}
                    className="!rounded"
                    onChange={handlePhoneChange}
                    value={phoneNumber}
                    onClick={() => {
                      mixpanel.track("form_start", {
                        input: "Phone edited",
                        bootcamp: bootcamp?.Bootcamp?.title,
                      });
                    }}
                  />
                </FormControl>
                {phoneValidationError ? (
                  <span className="text-sm font-medium text-red-500">
                    {phoneValidationError}
                  </span>
                ) : (
                  <FormMessage />
                )}
              </FormItem>
            )}
          />
          {!isToken ? (
            <div className="flex flex-col gap-1">
              <div
                onClick={handleApplyCouponClick}
                className="w-full h-full flex p-0"
              >
                <SelectCoupon
                  phoneNumber={phoneNumber}
                  isSelectCouponEnabled={isSelectCouponEnabled}
                  setFinalCouponSelected={setFinalCouponSelected}
                  setCouponDiscount={setCouponDiscount}
                  originalOrderAmount={price}
                  coupons={coupons}
                  bootcamp={bootcamp}
                />
              </div>
              <span className="text-red-500 text-sm">
                {errorMessageSelectCoupons}
              </span>
            </div>
          ) : null}

          {bootcamp?.Bootcamp?.metaData?.goldcard === "true" && (
            <GoldCard
              price={price}
              addPlan={addPlan}
              setAddPlan={setAddPlan}
              setPrice={setPrice}
              bootcamp={bootcamp}
            />
          )}

          <Summary
            isToken={isToken}
            isDiscounted={isDiscounted}
            tokenAmount={parseInt(mainButtonAmount)}
            price={parseInt(mainButtonAmount)}
            addPlan={addPlan}
            bootcamp={bootcamp}
            couponDiscount={couponDiscount}
          />
          {isToken && (
            <div className="text-foreground text-sm font-medium">
              This is a token payment. Please pay{" "}
              <span className="font-bold">₹{mainButtonAmount}</span> now and the
              remaining amount of{" "}
              <span className="font-bold">
                ₹{parseInt(BaseAmount, 10) - parseInt(mainButtonAmount, 10)}
              </span>{" "}
              will be due later.
            </div>
          )}
          {isToken ? (
            <Button className="w-full text-lg" size="lg" disabled={isLoading}>
              {isLoading
                ? "Loading..."
                : `Pay Token ₹${
                    parseInt(mainButtonAmount, 10) + (addPlan ? 999 : 0)
                  }`}
            </Button>
          ) : (
            <Button className="w-full text-lg" size="lg" disabled={isLoading}>
              {isLoading
                ? "Loading..."
                : `Enroll Now ${(
                    parseInt(mainButtonAmount) +
                    (addPlan ? 999 : 0) -
                    (couponDiscount ? couponDiscount : 0)
                  ).toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    minimumFractionDigits: 0,
                  })}`}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
