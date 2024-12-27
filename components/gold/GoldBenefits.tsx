import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { benefits } from "@/pages/gold";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

export default function GoldBenefits({
  open,
  closeDrawer,
}: {
  open: boolean;
  closeDrawer: () => void;
}) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", () => {
      setIsMobile(window.innerWidth < 768);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setIsMobile(window.innerWidth < 768);
      });
    };
  }, []);

  if (isMobile) {
    return (
      <Drawer shouldScaleBackground open={open} onClose={closeDrawer}>
        <DrawerContent
          onOverlayClick={closeDrawer}
          className="bg-[#fdf5ea] focus-visible:outline-none"
        >
          <GoldBenefitsContent />
        </DrawerContent>
      </Drawer>
    );
  } else {
    return (
      <Dialog open={open} onOpenChange={closeDrawer}>
        <DialogContent className="p-0 w-full max-lg:min-w-[90vw] min-w-[80vw] !bg-[#fdf5ea]">
          <GoldBenefitsContent className="max-h-[90vh] w-full h-full pt-0 pb-6" />
        </DialogContent>
      </Dialog>
    );
  }
}

function GoldBenefitsContent({ className = "" }) {
  return (
    <>
      <Image
        src="/gold/waves.svg"
        width={428}
        height={2056}
        alt="wavy background"
        className="fixed max-md:inset-0 md:top-0 md:left-0 opacity-25"
      />
      <Image
        src="/gold/waves2.svg"
        width={662}
        height={1870}
        alt="wavy background"
        className="max-md:hidden fixed top-0 right-0 opacity-25"
      />

      <section
        className={cn(
          "relative py-4 mt-2 max-h-[80vh] overflow-y-scroll mx-auto hide_scrollbar container max-w-5xl",
          className
        )}
      >
        <div className="flex items-center justify-center gap-2.5">
          <Image src="/gold/star.svg" alt="Star" width={15} height={15} />
          <h3 className="uppercase text-base font-semibold tracking-[6px]">
            Gold Benefits
          </h3>
          <Image src="/gold/star.svg" alt="Star" width={15} height={15} />
        </div>
        <div className="mt-1 md:mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {benefits.goldBenefits.map((benefit, index) => (
            <motion.div
              key={benefit.header}
              initial={{
                opacity: 0,
                translateY: 40,
              }}
              whileInView={{
                opacity: 1,
                translateY: 0,
              }}
              transition={{ duration: 0.4, type: "tween" }}
              viewport={{ once: true }}
              className={cn(
                "w-full rounded-xl border-2 border-[#FFD691] bg-gradient-to-b from-white to-[#FFF7EA] p-6 pb-9",
                index === 0 || index === 5
                  ? "col-span-1 md:col-span-2"
                  : "col-span-1"
              )}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Image src="/gold/dash.svg" alt="Dash" width={45} height={45} />
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 relative">
                    <Image src="/gold/bars.svg" alt="Bars Icon" fill />
                  </div>
                  <h4 className="text-[#694A07] font-bold whitespace-nowrap">
                    {benefit.header}
                  </h4>
                </div>
                <Image
                  src="/gold/dash.svg"
                  alt="Dash"
                  width={45}
                  height={45}
                  className="rotate-180"
                />
              </div>
              <div
                className={cn(
                  "gap-y-[30px] gap-x-[78px] grid grid-cols-1 mt-3.5",
                  index === 0 && "md:grid-cols-2",
                  index === 5 ? "md:w-fit md:mx-auto" : "mx-0"
                )}
              >
                {benefit.points.map((point) => (
                  <div key={point.title} className="flex items-center gap-5">
                    <div className="relative h-[40px] w-[40px]">
                      <Image
                        src={`/gold/benefits/${point.icon}`}
                        alt={point.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className={`space-y-1 flex-1 `}>
                      <div className="flex items-center justify-between">
                        <h5 className="font-semibold lg:w-[200px]">
                          {point.title}
                        </h5>

                        <p className="bg-gradient-to-r from-[#9A7026] via-[#D8AB65] to-[#9A7026] bg-clip-text text-transparent tracking-[0] whitespace-nowrap font-bold">
                          ₹{point.price}
                        </p>
                      </div>
                      <p className="text-[15px] leading-snug text-zinc-700">
                        {point.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other Benefits */}
        <div className="flex items-center justify-center gap-2.5 mt-10">
          <Image src="/gold/star.svg" alt="Star" width={15} height={15} />
          <h3 className="uppercase text-base font-semibold tracking-[6px]">
            Other Benefits
          </h3>
          <Image src="/gold/star.svg" alt="Star" width={15} height={15} />
        </div>
        <div className="mt-1 md:mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {benefits.otherBenefits.map((benefit) => (
            <motion.div
              key={benefit.header}
              initial={{
                opacity: 0,
                translateY: 40,
              }}
              whileInView={{
                opacity: 1,
                translateY: 0,
              }}
              transition={{ duration: 0.4, type: "tween" }}
              viewport={{ once: true }}
              className="w-full col-span-1 rounded-xl border-2 border-[#FFD691] bg-gradient-to-b from-white to-[#FFF7EA] p-6 pb-9"
            >
              <div className="flex items-center justify-center gap-1.5">
                <Image src="/gold/dash.svg" alt="Dash" width={45} height={45} />
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 relative">
                    <Image src="/gold/bars.svg" alt="Bars Icon" fill />
                  </div>
                  <h4 className="text-[#694A07] font-bold whitespace-nowrap">
                    {benefit.header}
                  </h4>
                </div>
                <Image
                  src="/gold/dash.svg"
                  alt="Dash"
                  width={45}
                  height={45}
                  className="rotate-180"
                />
              </div>
              <div className="space-y-[30px] mt-3.5">
                {benefit.points.map((point) => (
                  <div key={point.title} className="flex items-center gap-5">
                    <div className="relative h-[40px] w-[40px]">
                      <Image
                        src={`/gold/benefits/${point.icon}`}
                        alt={point.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      <h5 className="font-semibold">{point.title}</h5>
                      <p className="text-[15px] leading-snug text-zinc-700">
                        {point.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
