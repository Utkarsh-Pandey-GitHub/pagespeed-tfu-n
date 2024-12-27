import { InformationCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import JoinWhatsAppModal from "../Masterclass/JoinWhatsappModal";
import mixpanel from "@/utils/mixpanel"

dayjs.extend(advancedFormat);

const SlpFormSchema = z.object({
  phone: z.string().min(10, { message: "Phone number should be 10 digits" }),
});

export default function SlpForm({
  masterClass,
  onClick,
  bucket,
  abTestType,
}: {
  masterClass: any;
  onClick?: any;
  bucket?: "A" | "B";
  abTestType?: string;
}) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<z.infer<typeof SlpFormSchema>>({
    resolver: zodResolver(SlpFormSchema),
  });
  const router = useRouter();
  const [showJoiningPopup, setShowJoiningPopup] = useState(false);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  const activeSlot = masterClass?.slots?.find((slot: any) => {
    return slot.active == true;
  });

  function submitForm(data: z.infer<typeof SlpFormSchema>) {
    setLoading(true);
    axios.post(`${process.env.NEXT_PUBLIC_BASE_API}leads`, {
      email: "",
      name: "Tradewise_user",
      phone: data.phone,
      source: router.query.source || "direct",
      comment: router.query.comment || "",
      masterclassSlotId: activeSlot.id,
      masterclassId: masterClass?.id,
      ...(bucket && abTestType && {
        payload: {
          bucket,
          abTestType,
        },
      }),
    })
      .then((res) => {
        mixpanel.track("lead_submit", {
          source: router.query.source || "direct",
          comment: router.query.comment || "no_comment",
          type: "free",
          masterclassId: masterClass?.id
        })
        const customEvent = new CustomEvent("lead_form_submitted", {
          detail: {
            masterclassSlotId: activeSlot?.id,
            masterclassId: masterClass?.id,
          },
        });
        document.dispatchEvent(customEvent);
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "lead_form_submitted" });
        reset();
        setLoading(false);
        setShowJoiningPopup(true);
      });
  }

  return (
    <div className="relative">
      <JoinWhatsAppModal
        isOpen={showJoiningPopup}
        masterclass={masterClass}
        onClose={setShowJoiningPopup}
        joiningLink={activeSlot?.whatsappGroupLink}
      />
      <form
        onSubmit={handleSubmit(submitForm)}
        onClick={onClick}
        className="md:py-5 pt-2"
      >
        {activeSlot && (
          <div className="text-sm md:p-4 p-2 rounded-lg bg-green-200 border border-green-300 flex items-center gap-2">
            <span>
              <InformationCircleIcon className="w-5 h-5 stroke-[2]" />
            </span>
            <span>
              Upcoming masterclass is on{" "}
              <span className="font-semibold">
                {dayjs(activeSlot.startDateTime).format("Do MMM (dddd)")}
              </span>{" "}
              at{" "}
              <span className="font-semibold">
                {dayjs(activeSlot.startDateTime).format("h:mm A")}
              </span>
            </span>
          </div>
        )}
        <h3 className="md:text-lg text-sm font-semibold md:mb-3 text-center md:mt-3 mt-1 mb-1 ">
          Please Enter Your Details
        </h3>
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
            type="text"
            name="phone"
            label="Phone Number"
            placeholder="Enter your phone number"
            register={register}
            errors={errors}
          />
        </div>
        <div className="w-full flex items-center justify-center">
          <button
            className="btn-block btn-pill mt-3 btn-dark relative"
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
