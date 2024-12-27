import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Coins } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useState } from "react";
import { signIn } from "next-auth/react";
import mixpanel from "@/utils/mixpanel";
import { useRouter } from "next/router";

export default function VerifyPopup() {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const data = JSON.parse(localStorage.getItem("tfu-user-auth") || "{}");
  const phone = data.phone;

  const handleOTPSubmit = async () => {
    try {
      mixpanel.track("otp verify", {
        phone,
      });
      const result = await signIn("otp", {
        phone: phone.replaceAll("+91", ""),
        otp,
        redirect: false,
      });
      if (result?.ok) {
        toast.success("Phone number verified successfully");
      } else {
        toast.error("An error occurred during verification");
      }
    } catch (error) {
      toast.error("An error occurred during verification");
    }
  };

  if (!phone) {
    router.push("/gifff");
    return null;
  }

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent className="max-w-xs rounded-lg p-3 overflow-hidden">
        <AlertDialogHeader>
          <Image
            src="/gifff/congrats.gif"
            width={100}
            height={100}
            alt="congrats"
            unoptimized
            className="w-full -my-4"
          />
          <AlertDialogTitle className="text-center">
            You got 50{" "}
            <Coins
              size={20}
              className="mr-1 inline fill-yellow-600 text-yellow-400"
            />
            coins
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center px-12">
            Verify your OTP sent to {phone} to get your coins
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <div className="flex gap-1">
            <Input
              type="tel"
              name="otp"
              placeholder="Enter OTP"
              className="w-full"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button
              onClick={handleOTPSubmit}
              className="rounded-lg px-4 font-bold text-lg bg-fuchsia-950"
            >
              Verify
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
