import {
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Modal from "./ui/Modal";
import Image from "next/image";

export default function LogoutModal({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleLogout = () => {
    signOut({ redirect: false }).then(() => {
      setIsProcessing(true);
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BASE_API}auth/logout`,
          {},
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.status === 200) {
            toast.success("Logged Out Successfully");
            window.location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsProcessing(false);
          closeModal();
        });
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      className="!max-w-sm !border-none !flex !flex-col !justify-center !items-center !p-4"
    >
      <XMarkIcon
        onClick={closeModal}
        className="h-6 w-6 bg-black rounded-full p-1 text-slate-200 absolute right-5 top-5 hover:cursor-pointer"
      />
      <div className="flex flex-col justify-center items-center gap-3">
        <Image
          height={176}
          width={176}
          src="/tradewise/logout.gif"
          alt="decorative gif"
        />
        <p className="text-center font-semibold">
          Are you sure you want to log out? We can&apos;t notify you of new
          classes!
        </p>
        <div className="flex flex-col justify-between items-center w-full gap-2">
          <button
            className="bg-[#0A2133] !text-white border-none w-full h-12"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            disabled={isProcessing}
            className={`!text-[#EA624E] border-none w-full h-12 flex flex-row gap-2 justify-center items-center ${
              isProcessing && "opacity-50 cursor-not-allowed"
            }`}
            onClick={() => {
              handleLogout();
            }}
          >
            <ArrowRightOnRectangleIcon className="!w-6 !h-6" />
            <p>Logout</p>
          </button>
        </div>
      </div>
    </Modal>
  );
}
