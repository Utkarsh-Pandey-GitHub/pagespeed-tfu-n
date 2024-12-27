import { Dialog, Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
// import Link from "next/link";
import { Fragment } from "react";
import mixpanel from "@/utils/mixpanel";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JoinWhatsAppModal({
  isOpen,
  onClose,
  masterclass,
  joiningLink = "https://linktr.ee/",
}: {
  isOpen: any;
  onClose: any;
  masterclass: any;
  joiningLink: string;
}) {
  const router = useRouter();
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all border border-white/5">
                <CheckCircleIcon className="w-16 h-16 mb-3 mx-auto text-blue-500 border border-blue-500 rounded-full" />
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold leading-6 text-black"
                >
                  Thank you for Registering!
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-black opacity-80">
                    Join our Whatsapp community to know more about the
                    masterclass and get notified when it&apos;s live.
                  </p>
                </div>

                <div className="mt-4 text-center">
                  <Link
                    href={joiningLink}
                    target="_blank"
                    className="custom-gradient mx-auto flex justify-center gap-2 btn-lg py-2 rounded-md"
                    onClick={() => {
                      mixpanel.track("join_whatsapp", {
                        masterclass: masterclass?.title,
                        masterclassId: masterclass?.id,
                        action: "join",
                        type: "manual"
                      });
                      router.push(joiningLink);
                    }}
                  >
                    <span>
                      <Image
                        src="/tradewise/whatsapp.svg"
                        width={28}
                        height={28}
                        className=""
                        alt="whatsapp icon"
                      />
                    </span>
                    <span className="text-white font-semibold">
                      Join Whatsapp Community
                    </span>
                  </Link>

                  <a
                    onClick={() => {
                      mixpanel.track("join_whatsapp", {
                        masterclass: masterclass?.title,
                        masterclassId: masterclass?.id,
                        action: "reject",
                        type: "manual"
                      });
                      onClose();
                    }}
                  >
                    <span className="mt-3 block tex-sm opacity-80 text-[#1E70EC]">
                      I will join later
                    </span>
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}