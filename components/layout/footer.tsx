import mixpanel from "@/utils/mixpanel";
import webengage from "@/webengage";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const socialIcons = [
  {
    socialUrl: "https://in.linkedin.com/company/thefutureuniversity",
    iconUrl: "/white-linkedin.svg",
    alt: "linkedin-icon",
  },
  {
    socialUrl: "https://chat.whatsapp.com/HOshFRLP2UV7AG7Xfn15tO",
    iconUrl: "/white-whatsapp.svg",
    alt: "whatsapp-icon",
  },
  {
    socialUrl: "https://youtube.com/@tradewiseofficial",
    iconUrl: "/white-youtube.svg",
    alt: "youtube-icon",
  },
  {
    socialUrl: "https://www.instagram.com/tradewise__/",
    iconUrl: "/white-instagram.svg",
    alt: "instagram-icon",
  },
];

const desktopList = [
  {
    iconUrl: "/location-fill.svg",
    text: "D-178, La Daftar, Phase 8B, Sector-74, SAS Nagar Mohali, Punjab, India 140308",
  },
];

export default function Footer({
  hidden = false,
  className,
  phone = "080-468-10701",
}: {
  hidden: boolean;
  className?: string;
  phone?: string;
}) {
  if (hidden) {
    return null;
  }

  return (
    <React.Fragment>
      {/* Mobile */}
      <footer
        className={`block lg:hidden px-4 py-8 sm:px-6 md:px-10 bg-foreground text-zinc-50 ${className}`}
      >
        <Image
          src="/logo-light.svg"
          alt="Tradewise App"
          width={110}
          height={110}
          className="mx-auto"
        />
        <p className="mt-4 text-sm text-center leading-loose max-sm:max-w-xs mx-auto">
          D-178, La Daftar, Phase 8B, Sector-74, SAS Nagar Mohali, Punjab, India
          140308
        </p>
        <div className="mt-3.5 flex items-center justify-center gap-1 text-sm">
          <Link
            href="/privacy-policy"
            className="text-white text-center"
            onClick={() =>
              mixpanel.track("privacy_policy", {
                location: "footer",
              })
            }
          >
            Privacy Policy
          </Link>
          <span>|</span>
          <Link
            href="/terms-and-conditions"
            className="text-white text-center"
            onClick={() =>
              mixpanel.track("terms_and_conditions", {
                location: "footer",
              })
            }
          >
            Terms and Conditions
          </Link>
          <span>|</span>
          <Link
            href="/refund-policy"
            className="text-white text-center"
            onClick={() =>
              mixpanel.track("refund_policy", {
                location: "footer",
              })
            }
          >
            Refund Policy
          </Link>
        </div>
        <div className="mt-4 flex items-center justify-center gap-3">
          {socialIcons.map((item, i) => (
            <Link href={item.socialUrl} key={i} target="_blank" className="p-1">
              <Image src={item.iconUrl} width={22} height={22} alt={item.alt} />
            </Link>
          ))}
        </div>
      </footer>

      {/* Desktop */}
      <footer
        className={`hidden lg:block py-8 px-20 bg-[#020717] ${className}`}
      >
        <div className="flex justify-between border-b-[1px] pb-6 border-[#e8e8e8a2]">
          <div className="flex flex-col justify-between">
            <Image
              src="/logo-light.svg"
              alt="Tradewise App"
              width={110}
              height={110}
            />
            <Link
              href="/become-instructor"
              onClick={() => {
                const _webengage = webengage();
                if (_webengage) {
                  _webengage.track("Become Instructor Clicked", {
                    source: "Tradewise",
                  });
                }
                mixpanel.track("become_instructor", {
                  page_referrer: document.referrer,
                  location: "footer",
                });
              }}
              className="text-white"
            >
              Become Instructor
            </Link>
          </div>

          <ul className="max-w-[600px] space-y-4">
            <li className="flex gap-6 items-start text-[#E8E8E8E5]">
              <a
                href={`tel:7740034081`}
                onClick={() => {
                  const _webengage = webengage();
                  if (_webengage) {
                    _webengage.track("Contact Us", {
                      source: "Tradewise",
                      type: "Call",
                    });
                  }
                }}
                className="flex gap-6 items-start text-[#E8E8E8E5]"
              >
                <Image
                  src="/call-fill.svg"
                  width={22}
                  height={22}
                  alt="social-icon"
                />
                Call us directly on 7740034081
              </a>
            </li>
            <li className="flex gap-6 items-start text-[#E8E8E8E5]">
              <a
                href={`https://wa.me/919056187997`}
                className="flex gap-6 items-start text-[#E8E8E8E5]"
                onClick={() => {
                  const _webengage = webengage();
                  if (_webengage) {
                    _webengage.track("Contact Us", {
                      source: "Tradewise",
                      type: "Chat",
                    });
                  }
                }}
              >
                <Image
                  src="/wp-fill.svg"
                  width={22}
                  height={22}
                  alt="social-icon"
                />
                Whatsapp us on +91 9056187997
              </a>
            </li>
            {desktopList.map((item, i) => (
              <li key={i} className="flex gap-6 items-start text-[#E8E8E8E5]">
                <Image
                  src={item.iconUrl}
                  width={22}
                  height={22}
                  alt="social-icon"
                />
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between w-full">
          <div className="mt-3.5 flex items-center gap-2.5">
            <Link href="/privacy-policy" className="text-white !text-sm">
              Privacy Policy
            </Link>
            <span className="text-white">|</span>
            <Link href="/terms-and-conditions" className="text-white !text-sm">
              Terms and Conditions
            </Link>
            <span className="text-white">|</span>
            <Link href="/refund-policy" className="text-white !text-sm">
              Refund Policy
            </Link>
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            {socialIcons.map((item, i) => (
              <Link
                href={item.socialUrl}
                key={i}
                target="_blank"
                className="p-1"
              >
                <Image
                  src={item.iconUrl}
                  width={20}
                  height={20}
                  alt={item.alt}
                />
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
}
