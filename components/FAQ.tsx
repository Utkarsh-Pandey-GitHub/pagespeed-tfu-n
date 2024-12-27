import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import webengage from "@/webengage";
import mixpanel from "@/utils/mixpanel";

const bulletPoints = [
  { text: "Verified expert" },
  { text: "Interactive live classes" },
  { text: "Live market support" },
];

const faqs = [
  {
    question: "How can I sign up for a free masterclass?",
    answer:
      "You can sign up for our free masterclasses by visiting our website and registering with your phone number. We will send you all the details needed to join.",
  },
  {
    question:
      "Will I receive any materials or resources after the masterclass?",
    answer:
      "Yes, participants of our free masterclasses will receive a free ebook and additional resources to further explore the topic.",
  },
  {
    question:
      "Do I need any special equipment or software to participate in the classes?",
    answer:
      "For most classes, you just need a stable internet connection and a device to join the online sessions.",
  },
];

const FAQ = ({ isAccHidden = false, accordianClasses = "" }) => {
  const [activeFAQ, setActiveFAQ] = React.useState<number[]>([]);
  const contentRef = React.useRef<(HTMLDivElement | null)[]>([]);

  const toggleFAQ = (index: number) => {
    mixpanel.track("faq_click", {
      location: "above_footer",
      question: faqs[index].question,
    });
    setActiveFAQ((prev) => {
      if (prev.includes(index)) {
        return prev.filter((item) => item !== index);
      }

      return [...prev, index];
    });
  };

  return (
    <section className="relative mt-16 sm:mt-20 md:mt-28 lg:mt-32 bg-white">
      {!isAccHidden && (
        <div className={cn("mx-auto", accordianClasses)}>
          <motion.h3
            initial={{ opacity: 0, translateY: 40 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            transition={{
              duration: 0.35,
              type: "tween",
            }}
            viewport={{ once: true }}
            className="text-center text-xl md:text-3xl font-bold"
          >
            Frequently Asked Questions
          </motion.h3>
          <div className="mt-4 md:mt-7 space-y-3">
            {faqs.map((faq, index) => {
              const isActive = activeFAQ.includes(index);
              return (
                <motion.div
                  initial={{ opacity: 0, translateY: 40 }}
                  whileInView={{ opacity: 1, translateY: 0 }}
                  transition={{ duration: 0.35, type: "tween" }}
                  viewport={{ once: true }}
                  className="p-4 bg-[#041C330F] cursor-pointer overflow-hidden rounded-xl transition-all duration-200 ease-linear"
                  onClick={() => toggleFAQ(index)}
                  key={index}
                >
                  <div className="flex justify-between items-center">
                    <p className="w-[85%] text-[15px] md:text-lg text-[#041C33] font-semibold leading-tight">
                      {faq.question}
                    </p>
                    <ChevronDown
                      size={25}
                      className={cn(
                        "transition-transform duration-200 ease-linear",
                        isActive ? "-rotate-180" : "rotate-0"
                      )}
                    />
                  </div>
                  <div
                    ref={(el) => (contentRef.current[index] = el)}
                    className="overflow-hidden transition-max-height duration-200 ease-linear"
                    style={{
                      maxHeight: isActive
                        ? `${contentRef.current[index]?.scrollHeight}px`
                        : "0px",
                    }}
                  >
                    <p
                      data-state={isActive ? "open" : "closed"}
                      className="mt-1.5 text-[15px] font-medium leading-normal text-[#041C3399] w-[85%] data-[state=open]:opacity-100 data-[state=closed]:opacity-0 transition-opacity duration-300 ease-linear"
                    >
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, translateY: 40 }}
        whileInView={{ opacity: 1, translateY: 0 }}
        transition={{
          duration: 0.35,
          type: "tween",
        }}
        viewport={{ once: true }}
        className="rounded-md bg-[#FFF9F3] md:mt-[88px] mt-6 pt-5 px-7 md:pt-7 pb-0"
      >
        <div className="flex flex-col md:flex-row-reverse gap-6 md:gap-4 justify-center md:justify-between max-md:text-center container">
          <Image
            src="/faq-img.png"
            height={290}
            width={420}
            alt="Mobile trading app interface showing a course preview"
            className="max-md:mx-auto object-contain md:object-bottom"
          />
          <div className="flex flex-col justify-center max-md:items-center pb-5 md:pb-7">
            <h3 className="text-[21px] md:text-[25px] lg:text-[30px] leading-tight max-w-[400px] md:max-w-[550px] md:mt-4 text-[#3C4852]">
              Download Tradewise App for Online learning like never before
            </h3>
            <div className="space-y-2 mt-6">
              {bulletPoints.map((item, i) => (
                <div key={i} className="flex max-md:justify-center gap-2">
                  <Image
                    src="/checkbox.svg"
                    width={20}
                    height={20}
                    alt="Checkbox"
                  />
                  <p className="font-medium md:text-[20px] text-[#161C2B]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-6">
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
              {/* <Link href="#">
                <Image
                  src="/app-store-badge.svg"
                  width={154}
                  height={45}
                  alt="App Store CTA"
                />
              </Link> */}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default FAQ;
