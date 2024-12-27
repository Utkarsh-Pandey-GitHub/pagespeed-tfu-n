import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Video,
  Tv,
  MessageSquare,
  GraduationCap,
  CheckCircle,
} from "lucide-react";
import { BootcampSlugData } from "@/types/bootcamp-slug";
import Image from "next/image";

const features = [
  {
    title: "Live Classes",
    icon: Video,
    description:
      "We provide live classes to our students. You can attend the classes from anywhere in the world.",
  },
  {
    title: "Session Recordings",
    icon: Tv,
    description:
      "We save all the session recordings in case you miss a class or want to rewatch a class.",
  },
  {
    title: "Lifetime Community",
    icon: MessageSquare,
    description:
      "Things are better when you do them with others. We have a community of 1000+ students who are learning together.",
  },
  {
    title: "Personalized Assistance",
    icon: GraduationCap,
    description:
      "We have a dedicated team of mentors who are available to help you with any doubts you have.",
  },
];

export const audienceTypes = [
  { type: "Employee", bgColor: "bg-emerald-100" },
  { type: "Trader", bgColor: "bg-yellow-100" },
  { type: "Business", bgColor: "bg-blue-100" },
  { type: "Freelancer", bgColor: "bg-sky-100" },
];

const certificateBenefits = [
  "Official And Verified",
  "Easily Shareable",
  "Enhances Your Credibility",
  "This Is The Fourth Benefit",
];

export default function Overview({
  bootcamp,
}: {
  bootcamp: BootcampSlugData["data"];
}) {
  return (
    <section className="space-y-6 p-2">
      <div
        className="prose max-w-full prose-p:text-justify prose-h2:text-[#002082] prose-h2:text-[20px] prose-h2:font-semibold prose-p:text-[#161C2B] prose-p:text-base prose-li:text-base prose-li:text-[#161C2B] prose-ul:list-disc"
        dangerouslySetInnerHTML={{
          __html: bootcamp?.Bootcamp?.longDescription,
        }}
      />

      <section>
        <h4 className="text-lg font-semibold text-blue-900 mb-4">
          Who is this Bootcamp for
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {audienceTypes?.map((audience) => (
            <Card
              key={audience.type}
              className={`${audience.bgColor} text-center`}
            >
              <CardContent className="p-4">
                <Image
                  src={`/tradewise/${audience.type.toLowerCase()}.gif`}
                  height={100}
                  width={100}
                  alt={audience.type}
                  className="mx-auto mb-2"
                />
                <p className="font-semibold">{audience.type}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <p>
        Anyone and everyone who is genuinely interested to make money in the
        stock market can attend this webinar.
      </p>

      {features.map((feature) => (
        <Card
          key={feature.title}
          className="border-0 border-l-4 border-blue-900 bg-blue-50"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold flex items-center w-full justify-between">
              {feature.title}
              <div className="size-8 flex items-center justify-center bg-blue-100 rounded-full">
                <feature.icon size={20} className="text-blue-900" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </CardContent>
        </Card>
      ))}

      <section>
        <h4 className="text-lg font-semibold text-blue-900 mb-4">
          Certificate of completion
        </h4>
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {bootcamp?.Bootcamp?.certificateImage && (
            <Image
              src={bootcamp.Bootcamp.certificateImage}
              alt="certificate"
              className="w-full object-contain rounded-xl"
              width={300}
              height={300}
            />
          )}
          <div className="space-y-2">
            {certificateBenefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 font-semibold"
              >
                <CheckCircle className="h-4 w-4" />
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
