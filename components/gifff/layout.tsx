import { cn } from "@/utils/cn";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import WalletBalance from "./wallet-balance";

export default function Layout({
  children,
  className,
  points,
}: {
  children: React.ReactNode;
  className?: string;
  points: number | undefined;
}) {
  const isAdmin =
    typeof window !== "undefined" ? localStorage.getItem("tw-isAdmin") : false;
  return (
    <section
      className={cn(
        "max-w-md w-screen relative mx-auto h-full flex flex-col overflow-x-hidden",
        className
      )}
    >
      <nav className="flex z-50 fixed w-screen max-w-md top-0 justify-between items-center bg-sky-950 p-4">
        <Image src="/logo-light.svg" alt="TGFFF" width={80} height={80} />
        <span>
          <WalletBalance balance={points} />
          {isAdmin === "true" && (
            <Button
              onClick={() =>
                signOut({
                  callbackUrl: "/gifff",
                })
              }
            >
              <LogOutIcon className="w-6 h-6 text-white" />
            </Button>
          )}
        </span>
      </nav>
      <div className="mt-auto">{children}</div>
    </section>
  );
}
