import webengage from "@/webengage";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Help() {
  return (
    <section className="space-y-4">
      <h4 className="text-blue-900 font-semibold">
        For more details about the course
      </h4>
      <p>
        If you have any question regarding the course and couldn't find the
        answer on this page, feel free to contact us
      </p>
      <h4 className="text-blue-900 font-semibold">Message us on Whatsapp</h4>
      <div className="flex flex-row justify-start items-center gap-2 w-full">
        <Image
          alt="Whatsapp"
          src="/tradewise/green-whatsapp.svg"
          width={40}
          height={40}
        />
        <div className="flex flex-col justify-start items-start gap-0">
          <Link
            href={"https://wa.me/919056187997"}
            onClick={() => {
              const _webengage = webengage();
              if (_webengage) {
                _webengage.track("Contact Us", {
                  source: "Tradewise",
                  type: "Chat",
                });
              }
            }}
            className="font-semibold"
          >
            +91 9056187997
          </Link>
          <p>Working Hours (10 AM - 10 PM)</p>
        </div>
      </div>
    </section>
  );
}
