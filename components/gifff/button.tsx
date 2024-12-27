import React from "react";
import { Button, ButtonProps } from "../ui/button";
import { cn } from "@/utils/cn";

export default function GifffButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        "bg-fuchsia-950 hover:bg-fuchsia-900 duration-300",
        props.className
      )}
    />
  );
}
