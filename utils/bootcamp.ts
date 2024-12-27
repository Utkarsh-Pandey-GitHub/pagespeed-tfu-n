import axios, { AxiosError } from "axios";
import type { BootcampSlugData } from "@/types/bootcamp-slug";
import webengage from "@/webengage";
import { NextRouter } from "next/router";
import { sendUsingSocket } from "./webSocket";
import mixpanel from "./mixpanel";

export const getBootcampBySlug = async (slug: string) => {
  try {
    const { data }: { data: BootcampSlugData } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API}bootcamps/batch-details/${slug}`,
      {
        headers: {
          "Accept-Encoding": "gzip",
        },
      }
    );
    return data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error fetching bootcamp by slug", error.response?.data);
    } else if (error instanceof Error) {
      console.error("Error fetching bootcamp by slug", error.message);
    } else {
      console.error("Error fetching bootcamp by slug", error);
    }
    return null;
  }
};

export enum paymentType {
  PAID_MASTERCLASS = "paidMasterClass",
  PAID_BOOTCAMP = "paidBootcamp",
  VIP = "vip",
  TOKEN = "token",
  RECOVERY = "recovery",
  DISCOUNTED = "discounted",
  GOLD = "gold",
  GOLD_BOOTCAMP = "goldBootcamp",
  TOKEN_PLUS_GOLD = "token-plus-gold",
}

export const purchaseBootcamp = async ({
  values,
  bootcamp,
  router,
  addPlan,
  paymentMethodType,
  userIp,
  finalCouponSelected,
  tokenValue,
}: {
  values: {
    name: string;
    phone: string;
    email: string;
  };
  bootcamp: any;
  router: NextRouter;
  addPlan: boolean;
  paymentMethodType?: string;
  userIp: string;
  finalCouponSelected: any;
  tokenValue?: string;
}) => {
  const source = router.query.source ?? "website";
  const token = tokenValue ?? router.query.token ?? "";

  // @ts-ignore
  window.gtag("event", "payment_razorpay_init", {
    event_category: "payment",
    event_label: "payment_submit",
    value: "",
  });

  mixpanel.alias(values.phone);
  mixpanel.people.set({
    $name: values.name,
    $email: values.email,
    $phone: values.phone,
  });
  mixpanel.identify(values.phone);

  mixpanel.track("payment_initiate", {
    source,
    paymentStage: "razorpay_init",
    payment_type: "Bootcamp",
  });

  const _webengage = webengage();
  if (_webengage) {
    _webengage.user.login(values.phone);
    _webengage.user.setAttribute("we_email", values.email);
    _webengage.user.setAttribute("we_phone", values.phone);
    _webengage.user.setAttribute("we_first_name", values.name);
    if (_webengage && bootcamp) {
      _webengage.track("Bootcamps registration initiated", {
        title: bootcamp?.Bootcamp?.title,
        instructor: bootcamp?.Bootcamp?.teacher?.name,
        fees: Number(bootcamp?.Bootcamp?.discountedPrice),
        source: "Astrolearn",
        industry: bootcamp?.Bootcamp?.teacher?.category?.name,
      });
    }
    _webengage.track("Payment initiated", {
      title: bootcamp.Bootcamp.title,
      category: "finance",
      fees: Number(bootcamp.Bootcamp.discountedPrice),
      duration: bootcamp.Bootcamp.duration,
      instructor: bootcamp.Bootcamp.teacher.name,
      source,
      cohort: new Date(bootcamp.startDateTime),
    });
  }

  const options = {
    ...values,
    bootcampId: bootcamp.Bootcamp.id,
    token,
    paymentMethodType,
    platform: "Tradewise",
    userIp,
    ...(finalCouponSelected && { couponId: finalCouponSelected?.id }),
    comment: source,
  };
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_BASE_API}payments/create-order`;
    const url = addPlan 
      ? `${baseUrl}?isGoldToken=true`
      : bootcamp.selectedSlots
        ? `${baseUrl}?osmSelectedSlots=${bootcamp.selectedSlots[0]}`
        : baseUrl;
    const { data: orderData } = await axios.post(url, options);
    const { id, gatewayOrderId, amount } = orderData.data;
    sendUsingSocket({
      type: "payment",
      status: "pending",
    });

    const rzpOptions = {
      prefill: {
        name: values.name,
        email: values.email,
        contact: "+91" + String(values.phone),
      },
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: Number(amount),
      currency: "INR",
      name: `Bootcamp: ${bootcamp.Bootcamp.title}`,
      description: bootcamp.Bootcamp.title,
      image:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAYAAABjPNNTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAELElEQVRYhd2YP08cRxjGfzOz/9j1gmwMVJhEREGRXGAK6hSpaenS5yPQWIrc2UUkS3QuHajjwh8grpGQkUKBFJtghADnEHfc3p/ZmUlx3s1hJ+E4zlzsRxrtnXY189tn3nnn3RG8UxzHP2VZ9n2aphHgGJKstaJer+dJkvyitf6h3W7XAQjD8Md3YP+bJqV0cRz/DCCEECoMw9+azebXgBFCqI/lUi8SQiCEsMYYGUVRM8/zL6WU0tdaSwDP88QwAQGstRhjBIDv+wCxR1f85Xk+JLR/Vq1WQyllpRBi6O5dJDlsgF70SUB6g+pICMHt27cxxjA2NgZ0YkprjVJ/J4zx8XGazSbHx8cEQUC1Wv34kEIIpJSsrKzw4MED9vb2SJIEgEajgTGG7rBXStFqtbhz5w5LS0s8f/78wjGuPN3OOaSURbooUgjGGPI8x1p7ro2MjHBycoJSip2dnZ7GuLKTSim01tRqNQDq9Xp5L8syrLXnnDw5OWFhYYG1tTUODw+vB9Ja2+nI80roPM+ZmppiZmamvF9ISsnjx4+5f/9+T/E4EEjn3DmnTk9PWVxcZG1tjUePHhGG4bnnz87O2N7exlqL53k9bSADW92FgiAA4NWrV2xubp67V7yMc51NrgiF4v+1QbZaLQBu3br1AcD7MO+Hwr+pr9XdPb0FyOjoKACjo6M456hUKhc61Ksu7aTv+2itmZ+fp1qt4vs+WZaVuXFsbIw8z5menmZxcZGjoyOCIMA5x+vXr9FaXxpSeJ4XOee2jDFfAZYe3A2CgFqtVsYfQLVapdVqkWUZWmumpqZI0xRjTLnjTE5Ocnx83AuXAwTQVEp9c2knpZR4nsfW1hZKqXKF3rx5k3a7TRRFCCGoVCrs7u6itebevXusrq7y9u3byw4H9DHdzjlu3LhBEARMTExQq9XwfR8pJUEQlLuK1po0TZmensZay9OnT/sC7BuyW1JKwjAkSRLSNEVrTRiGZf5bX1/n4cOHvHz5kn5L1yunoEajwezsLMvLy7x48YJWq0WSJGUqqlarNJtN4MMXvDbIorB48+YNBwcHAFQqlQ+eC4KAdrvd1xhXroKKqsf3/f+czn4BYQCQxpirdnGhPonPh88XUkpJlmWcnp5y9+5dnj17xubmJnEcD5qvI8/zIqXUDp2tyNDDOU2SJC7LMmetdfv7+25ubm7QZ0H23bWhlPqirxQ0MjLC+vo6GxsbPHnyBGstURSV+XDg6sfJokVRVP72ff+jOXmlhdPtXD8lWK/6fFf3dauAHNrx8wVyzrmywJBA36XUINVdKUVRJPM8F16e580gCHaAWWOMuSzooD62uiToZBnPGLNnjPkDAN/354DfhRBOSnmpJoQYaAOK659xHH9bUEvAKqVSKeV3QoiYTp4axtw7KaUAjNb6V2PMASD/AtDPYOlV/rQjAAAAAElFTkSuQmCC",
      handler: async () => {
        mixpanel.track("purchase", {
          page_referrer: document.referrer,
          bootcamp: bootcamp?.Bootcamp?.title,
        });
        router.push(
          bootcamp.Bootcamp.teacher.name === "Hiral Shah"
            ? `/payment/hiral/${bootcamp.Bootcamp.slug}?intent-id=${id}`
            : `/payment/${bootcamp.Bootcamp.slug}?intent-id=${id}`
        );
      },
      order_id: gatewayOrderId,
      theme: {
        color: "#000",
      },
    };

    // @ts-ignore
    const rzp = new window.Razorpay(rzpOptions);
    rzp.open();
  } catch (error) {
    mixpanel.track("exit_form", {
      location: "bootcamp",
      bootcamp: bootcamp?.Bootcamp?.title,
    });
    if (error instanceof AxiosError) {
      console.error("Error in creating order", error.response?.data);
    } else if (error instanceof Error) {
      console.error("Error in creating order", error);
    } else {
      console.error("Error in creating order", error);
    }
  }
};
