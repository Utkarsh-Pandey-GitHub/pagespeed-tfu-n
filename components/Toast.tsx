import { Transition } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import EventBus from "../eventBus";

interface NotificationData {
  type: "success" | "error";
  message: string;
}

export default function NotificationPopup() {
  const [data, setData] = useState<NotificationData>({
    type: "success",
    message: "",
  });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    EventBus.$on("showToast", (data: any) => {
      setIsActive(true);
      setData(data);

      setTimeout(() => {
        setIsActive(false);
      }, 5000);
    });
  }, []);

  return (
    <Transition
      show={isActive}
      enter="transition ease-out duration-300 transform"
      enterFrom="transform opacity-0 scale-75 -translate-y-3"
      enterTo="transform opacity-100 scale-100 -translate-y-0"
      leave="transition ease-in duration-150 transform"
      leaveFrom="transform opacity-100 scale-100 -translate-y-0"
      leaveTo="transform opacity-0 scale-95 -translate-y-3"
      className={`text-slate-800 rounded fixed top-2 right-2 shadow-xl px-4 py-2.5 z-30 inline-flex max-w-sm w-auto  text-sm bg-yellow-100`}
    >
      <span className="mr-3">
        {data?.type != "success" ? (
          <XCircleIcon className="w-5 h-5 text-red-600 stroke-[2]" />
        ) : (
          <CheckCircleIcon className="w-5 h-5 text-green-600 stroke-[2]" />
        )}
      </span>
      <span>{data?.message}</span>
    </Transition>
  );
}
