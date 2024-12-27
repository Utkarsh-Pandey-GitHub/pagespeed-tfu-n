import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
// import { useSession } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/utils/sidebarLinks";
import LogoutModal from "../LogoutModal";
import { Button } from "../ui/button";
import dynamic from "next/dynamic";
import mixpanel from "@/utils/mixpanel";

const Login = dynamic(
  () => import("tfu-login-module").then((module) => module.Button),
  {
    ssr: false,
  }
);

export default function Header({ gold }: { gold: boolean }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  // const { status, data: session } = useSession();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Free Masterclasses",
      href: "/masterclasses",
      showArr: true,
    },
    {
      label: "Explore Bootcamps",
      href: "/bootcamps",
      showArr: true,
    },
    {
      label: "Our Experts",
      href: "/teachers",
      showArr: true,
    },
    {
      label: "Tradewise Gold",
      href: "/gold",
      hideInMobile: true,
    },
    {
      label: "Contact Us",
      href: "/contact-us",
    },
    {
      label: "About",
      href: "/about-us",
    },
  ];

  const desktopNav = navLinks.filter(
    (link) =>
      link.href !== "/about-us" &&
      link.href !== "/contact-us" &&
      link.href !== "/"
  );

  return (
    <>
      <header
        className={cn(
          "z-50 sticky top-0 inset-x-0 h-16",
          !gold && "bg-white shadow",
          gold &&
            isScrolled &&
            "bg-gradient-to-b from-[#fdf5ea] from-75% to-transparent",
          gold && !isScrolled && "bg-[#fdf5ea]"
        )}
      >
        <nav className="w-full h-full container mx-auto flex items-center justify-between sm:px-4 md:px-6">
          <div className="flex items-center gap-1.5 h-full">
            <HamburgerIcon isOpen={isOpen} toggleMenu={toggleMenu} />
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="TradwiseApp Logo"
                width={110}
                height={110}
                priority
              />
            </Link>
          </div>
          <ul className="w-fit flex justify-center gap-3 items-center max-md:hidden">
            {desktopNav.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <li
                  onClick={() => {
                    mixpanel.track(
                      link.label.toLowerCase().split(" ").join("_"),
                      {
                        page_location: "Homepage",
                        page_referrer: document.referrer,
                        location: "navbar",
                      }
                    );
                  }}
                  key={link.href}
                >
                  <Link
                    href={link.href}
                    className="text-foreground lg:px-3 hover:[text-decoration:none] header-text-shadow grid place-items-center h-full group transition-all"
                  >
                    {link.label}
                    <div
                      className={cn(
                        "h-[1.5px] rounded-md bg-green-500 w-full transition-all ease-linear duration-300",
                        !isActive &&
                          "scale-x-0 group-hover:scale-x-100 origin-left",
                        isActive && "hidden"
                      )}
                    />
                    <div
                      className={cn(
                        "h-[1.5px] rounded-md bg-foreground w-full transition-all ease-linear delay-75 duration-500 -mt-[2px]",
                        !isActive &&
                          "scale-x-0 group-hover:scale-x-100 origin-left"
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* {status === "unauthenticated" || status === "loading" ? (
            Login && <Login darkMode={false} source="Tradewise" />
          ) : status === "authenticated" ? (
            <Menu>
              <Menu.Button as={"div"} className="p-0 border-0 w-fit">
                <div
                  className={`flex flex-row gap-2 p-2 relative justify-center items-center rounded-full border-[1px] ${
                    gold ? "border-[#996F25]" : "border-black"
                  } hover:cursor-pointer`}
                  onClick={() => {
                    setIsExpanded(!isExpanded);
                  }}
                >
                  {gold ? (
                    session?.user?.photo != "null" ? (
                      <img
                        src={session?.user?.photo}
                        alt=""
                        className="rounded-full object-cover w-8 h-8 border-[#996F25] border-[1px]"
                      />
                    ) : (
                      <div className="rounded-full bg-[#996F25] h-8 w-8 flex justify-center items-center text-[#FFF0DB]">
                        <p className="">
                          {session?.user?.name?.substring(0, 1).toUpperCase()}
                        </p>
                      </div>
                    )
                  ) : session?.user?.photo != "null" ? (
                    <img
                      src={session?.user?.photo}
                      alt=""
                      className="rounded-full object-cover !w-8 !h-8"
                    />
                  ) : (
                    <div className="rounded-full bg-[#012478] h-8 w-8 flex justify-center items-center text-[#BAD5F8]">
                      <p className="">
                        {session?.user?.name?.substring(0, 1).toUpperCase()}
                      </p>
                    </div>
                  )}

                  {isExpanded ? (
                    <ChevronUpIcon
                      className={`w-5 h-5 ${gold ? "text-[#996F25]" : ""}`}
                    />
                  ) : (
                    <ChevronDownIcon
                      className={`w-5 h-5  ${gold ? "text-[#996F25]" : ""}`}
                    />
                  )}
                </div>
              </Menu.Button>
              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-500"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-400"
                leave="transition ease-in duration-200"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="max-xl:fixed absolute top-16 right-44 max-xl:right-8 max-md:right-5 bg-white p-4 z-20 w-56 py-2 customShadow-lg text-left flex flex-col shadow-lg">
                  <Menu.Item as="div">
                    <div className="flex flex-col flex-1 gap-4">
                      {sidebarLinks.map((link: any, index: number) => {
                        return (
                          <Link
                            href={`https:thefuture.university${link.route}`}
                            key={index}
                            className={`flex flex-row gap-4 items-center justify-start p-3 rounded-lg hover:no-underline text-[#6675A4]`}
                          >
                            <Image
                              src={link.imgURL}
                              alt={link.label}
                              width={24}
                              height={24}
                            />

                            <p>{link.label}</p>
                          </Link>
                        );
                      })}
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      className={`flex flex-row gap-4 mt-4 items-center justify-start p-3 rounded-lg hover:no-underline text-[#6675A4] hover:cursor-pointer`}
                      onClick={() => {
                        setIsLogoutModalOpen(true);
                      }}
                    >
                      <ArrowRightOnRectangleIcon className="!w-6 !h-6" />

                      <p>Logout</p>
                    </div>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : null} */}

          <div
            data-state={isOpen ? "open" : "closed"}
            className="md:hidden overflow-x-hidden fixed bg-white z-30 w-full top-0 h-full min-h-screen data-[state=open]:[box-shadow:0px_0px_15px_10px_#12121233] data-[state=open]:right-0 data-[state=closed]:right-[100%] duration-200 ease-in-out transition-all delay-75"
          >
            <div className="w-full h-16 shadow pl-14 flex items-center">
              <Image
                src="/logo.svg"
                alt="TradwiseApp Logo"
                width={110}
                height={110}
                priority
              />
            </div>
            <div className="p-5">
              {/* {status === "authenticated" ? (
                gold ? (
                  <div
                    className="bg-foreground bg-no-repeat p-5 rounded-lg text-white flex items-start justify-between border-2 border-[#8C6115]"
                    style={{
                      backgroundImage:
                        "url(/tradewise/goldFrameLeft.svg),url(/tradewise/goldFrame.svg)",
                      backgroundPosition: "bottom left, top right",
                    }}
                  >
                    <div className="flex flex-row justify-start items-center gap-3">
                      {session?.user?.photo != "null" ? (
                        <img
                          src={session?.user?.photo}
                          alt=""
                          className="rounded-full object-cover w-12 h-12 border-2 border-[#8C6115]"
                        />
                      ) : (
                        <div className="rounded-full bg-[#FDF5EA] border-[#996F25] border-2 h-12 w-12 flex justify-center items-center text-[#8C6115]">
                          <p className="">
                            {session?.user?.name?.substring(0, 1).toUpperCase()}
                          </p>
                        </div>
                      )}
                      <div className="flex flex-col leading-5">
                        <p className="text-lg tracking-wide bg-gradient-to-r from-[#B58E48]  via-[#E4C791]  to-[#E6B966] bg-clip-text text-transparent font-semibold">
                          Welcome back!
                        </p>
                        <p className="text-[24px] font-semibold bg-gradient-to-r from-[#B58E48]  via-[#E4C791]  to-[#E6B966] bg-clip-text text-transparent">
                          {session?.user?.name?.split(" ")[0]}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row gap-1 justify-start items-center">
                      <img src="/tradewise/star.svg" className="w-8 h-8" />
                      <div className="flex flex-col justify-center items-start">
                        <small className="text-white">Tradewise</small>
                        <img src="/tradewise/gold.svg" className="w-12" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-foreground p-5 rounded-lg text-white flex items-center justify-start gap-3">
                    {session?.user?.photo != "null" ? (
                      <img
                        src={session?.user?.photo}
                        alt=""
                        className="rounded-full object-cover w-12 h-12"
                      />
                    ) : (
                      <div className="rounded-full bg-[#FDF5EA] h-12 w-12 flex justify-center items-center text-[#0A2133]">
                        <p className="">
                          {session?.user?.name?.substring(0, 1).toUpperCase()}
                        </p>
                      </div>
                    )}
                    <div className="flex flex-col leading-5">
                      <p className="text-lg tracking-wide text-[#FFFFFF] opacity-70">
                        Welcome back!
                      </p>
                      <p className="text-[24px] font-semibold">
                        {session?.user?.name}
                      </p>
                    </div>
                  </div>
                )*/}
              {/* ) : (
                <div className="bg-foreground p-5 rounded-lg text-white flex items-center justify-center">
                  <div className="flex-1">
                    <p className="text-lg font-bold tracking-wide">Hello</p>
                    <p>Please login/signup</p>
                  </div> */}
              {/* {Login && <Login darkMode={false} source="Tradewise" />} */}
              {/* </div>
              )} */}
              <div className="mt-2">
                {navLinks.map((link) => {
                  if (link.hideInMobile) return null;
                  return (
                    <div
                      key={link.href}
                      onClick={() => {
                        router.push(link.href);
                        setIsOpen(false);
                        mixpanel.track(
                          link.label.toLowerCase().split(" ").join("_"),
                          {
                            page_location: "Homepage",
                            page_referrer: document.referrer,
                            location: "navbar",
                          }
                        );
                      }}
                      role="link"
                      className="cursor-pointer"
                    >
                      <div className="w-full flex items-center justify-between border-b py-3 border-b-foreground/30 border-dotted">
                        <div className="flex items-center gap-4">
                          <Image
                            src={`/icons/${link.label
                              .toLowerCase()
                              .split(" ")
                              .join("-")}.svg`}
                            alt={link.label}
                            width={20}
                            height={20}
                          />
                          <p className="text-foreground font-medium">
                            {link.label}
                          </p>
                        </div>
                        {link.showArr && (
                          <ChevronRight className="h-6 w-6 text-foreground/70" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-3 mt-3 z-50">
                <Link
                  href="/privacy-policy"
                  className="text-foreground/70 text-xs"
                  onClick={() =>
                    mixpanel.track("privacy_policy", {
                      location: "footer",
                    })
                  }
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-and-conditions"
                  className="text-foreground/70 text-xs"
                  onClick={() =>
                    mixpanel.track("terms_and_conditions", {
                      location: "footer",
                    })
                  }
                >
                  Terms & Conditions
                </Link>
              </div>
            </div>
            <div
              onClick={() => router.push("/gold")}
              className="cursor-pointer absolute bottom-0 inset-x-0 z-40 w-screen h-full max-h-60 bg-[url(/gold/gold.svg)] bg-no-repeat bg-cover"
            ></div>
          </div>
        </nav>
      </header>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        closeModal={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
}

function HamburgerIcon({
  isOpen,
  toggleMenu,
}: {
  isOpen: boolean;
  toggleMenu: () => void;
}) {
  return (
    <div
      onClick={toggleMenu}
      className="!pr-2.5 !py-1 !pl-0 z-50 !border-none !bg-transparent md:hidden"
    >
      <div className="space-y-1.5 transform transition-transform duration-300">
        <div
          className={cn(
            "h-0.5 w-6 bg-black transition-all duration-300",
            isOpen && "rotate-45 translate-y-2"
          )}
        />
        <div
          className={cn(
            "h-0.5 w-6 bg-black transition-opacity duration-300",
            isOpen ? "opacity-0" : "opacity-100"
          )}
        />
        <div
          className={cn(
            "h-0.5 w-6 bg-black transition-all duration-300",
            isOpen && "-rotate-45 -translate-y-2"
          )}
        />
      </div>
    </div>
  );
}
