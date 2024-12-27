import { ReactNode } from "react";
import Image from "next/image";

export function SvgListItem({
  className,
  children,
  image,
}: {
  className?: string;
  children: ReactNode;
  image: string;
}) {
  return (
    <div className="flex items-center gap-5 text-[15px] font-semibold">
      <div className="w-9 flex justify-center items-center">
        <div className="!aspect-square rounded-full w-9 flex justify-center items-center bg-[#F70]">
          <Image src={image} alt="decorative images" height={25} width={25} />
        </div>
      </div>
      <div className={`${className} text-white md:text-[17px]`}>{children}</div>
    </div>
  );
}

export function IndexListItem({
  className,
  children,
  color = "red",
  index,
}: {
  className?: string;
  children: ReactNode;
  color?: string;
  index: number;
}) {
  return (
    <div className="flex items-center gap-5 text-[15px] bg-white w-full p-5 pl-0 rounded-lg max-w-lg">
      <div className=" bg-[#FFEBD9] w-10 text-[16px] flex justify-center items-center rounded-r text-[#F70]">
        {index}
      </div>
      <div className="w-full flex justify-center">
        <div className={`${className} md:text-[16px] font-semibold `}>
          {children}
        </div>
      </div>
    </div>
  );
}
