import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const faqs = [
  {
    question: "How can I sign up for a bootcamp and what equipment do I need?",
    answer:
      "You can sign up for our free bootcamps by visiting our website and registering with your phone number. We will send you all the details needed to join. For most bootcamps, you just need a stable internet connection and a device to join the online sessions.",
  },
  {
    question:
      "What materials, resources, and support will I receive, and will I have access to recordings of the live classes?",
    answer:
      "Participants of our bootcamps will receive access to a variety of resources, including ebooks, course materials, and additional resources to further explore the topic. You will also have lifetime access to the recordings of all live classes, allowing you to revisit the content anytime you want. Additionally, you will have access to our support team and WhatsApp community forums where you can ask questions and get help even after the bootcamp ends.",
  },
  {
    question: "What if I miss a live class?",
    answer:
      "If you miss a live class, you can always catch up by watching the recording, which will be available to you for life. Our bootcamps feature live classes where you can interact with the instructor and ask questions in real-time.",
  },
];

export default function FAQs() {
  return (
    <section className="p-4 pb-8 my-4 space-y-4">
      <h3 className="text-2xl font-bold text-blue-900 text-center">
        Frequently Asked Questions
      </h3>
      <Accordion type="multiple" className="space-y-2">
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.question}
            value={faq.question}
            className="p-4 px-6 bg-gray-100 rounded-xl"
          >
            <AccordionTrigger className="hover:no-underline text-left bg-transparent text-xl text-blue-900 hover:text-blue-700 border-0 p-0">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="pt-3 text-lg">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
