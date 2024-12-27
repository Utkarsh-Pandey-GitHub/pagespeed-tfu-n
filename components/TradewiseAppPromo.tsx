import webengage from "@/webengage";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const bulletPoints = [
  { text: "Verified expert" },
  { text: "Interactive live classes" },
  { text: "Live market support" },
];

export default function TradewiseAppPromo() {
  return (
    <div className="bg-orange-50 relative rounded-3xl m-4">
      <div className="grid place-items-center lg:grid-cols-2 gap-4 items-end">
        <div className="grid place-items-center max-lg:text-center p-6">
          <h3 className="text-xl md:text-2xl max-md:text-center">
            Download Tradewise App for Online learning like never before
          </h3>
          <div className="flex flex-wrap gap-2 my-2 items-center justify-center">
            {bulletPoints.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Image
                  src="/checkbox.svg"
                  width={20}
                  height={20}
                  alt="Checkbox"
                />
                <p className="font-medium">{item.text}</p>
              </div>
            ))}
          </div>
          <Link
            onClick={() => {
              const _webengage = webengage();
              if (_webengage) {
                _webengage.track("App Download initiated", {
                  source: "Tradewise",
                });
              }
            }}
            href="https://tradewise.onelink.me/E1gD/3ud7t7qs"
            target="_blank"
          >
            <Image
              src="/google-play-badge.svg"
              width={154}
              height={45}
              alt="Google Play CTA"
            />
          </Link>
        </div>
        <Image
          src="/faq-img.png"
          height={300}
          width={320}
          className="w-full max-w-sm pt-2 px-2"
          alt="Mobile trading app interface showing a course preview"
        />
      </div>
    </div>
  );
}
