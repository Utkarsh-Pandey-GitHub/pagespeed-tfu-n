import { ReactNode } from "react";
import Header from "./header";
import Footer from "./footer";
import { cn } from "@/utils/cn";

export default function Layout({
  children,
  className = "",
  gold = false,
  hideFooter = false,
  footerClassName = "",
  isContainerHidden = false,
  phone,
}: {
  className?: string;
  children: ReactNode;
  gold?: boolean;
  hideFooter?: boolean;
  footerClassName?: string;
  isContainerHidden?: boolean;
  phone?: string;
}) {
  return (
    <div className="flex flex-col h-full select-none">
      <div className={cn("flex-1", gold && "bg-[#fdf5ea]")}>
        <Header gold={gold} />
        <main
          className={cn(
            className,
            isContainerHidden ? "w-full" : "container p-4 md:p-6"
          )}
        >
          {children}
        </main>
      </div>
      <Footer hidden={hideFooter} className={footerClassName} phone={phone} />
    </div>
  );
}
