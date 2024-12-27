import { ReactNode } from "react";

export default function ButtonPrimary({
  children,
  onClick,
  className,
}: {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-[20px] text-lg leading-4 px-[30px] ${className}`}
    >
      {children} {"->"}
    </button>
  );
}
