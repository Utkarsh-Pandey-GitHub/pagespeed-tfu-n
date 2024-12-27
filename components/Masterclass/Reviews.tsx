import { useEffect, useRef } from "react";
import NewLeadForm from "./New-lead-form";
import ReviewCard from "./ReviewCard";
import { BootcampReviews, MasterclassReviews } from "@/utils/reviews";
import { CLASS_TYPE } from "@/pages/bootcamps";
import BootcampForm from "../Bootcamp/Bootcampform";
import { useRouter } from "next/router";
import { BootcampSlugData } from "@/types/bootcamp-slug";

export default function Reviews({
  data,
  scroll,
  setScroll,
  price,
  setPrice,
  type,
  offerEndTime,
  addPlan,
  setAddPlan,
}: {
  data: any;
  scroll?: boolean | undefined;
  setScroll?: React.Dispatch<any>;
  price?: any;
  setPrice?: React.Dispatch<any>;
  type: string;
  offerEndTime: any;
  addPlan?: boolean;
  setAddPlan?: React.Dispatch<boolean>;
}) {
  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scroll === true) {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
      if (setScroll) {
        setTimeout(() => {
          setScroll(false);
        }, 100);
      }
    }
  }, [scroll]);
  let reviewsArray: any;

  if (type === CLASS_TYPE.BOOTCAMP) {
    reviewsArray = BootcampReviews.find((review: any) => {
      return data?.Bootcamp?.slug === review.bootcamp;
    });
  } else {
    reviewsArray = MasterclassReviews.find((review: any) => {
      return data?.masterClass?.slug === review.masterclass;
    });
  }

  const router = useRouter();
  return (
    <div className="py-3 w-full">
      <h4 className="text-[#002082] font-semibold mb-5">Reviews</h4>
      <div className="flex flex-col w-full gap-5">
        {reviewsArray ? (
          reviewsArray?.reviews?.review?.map((review: any, index: number) => {
            const reviewer = reviewsArray?.reviews?.name[index];
            if (reviewer && typeof reviewer === "object") {
              return (
                <ReviewCard
                  key={index}
                  name={reviewer?.name}
                  profession={reviewer?.profession}
                  time={reviewer?.days}
                  rating={reviewer?.rating}
                  message={review}
                />
              );
            }
          })
        ) : (
          <>
            <ReviewCard
              name="Rohan Patel"
              profession="Business Man"
              time={6}
              rating={4.5}
              message="I have been learning from Tradewise for 2 years. Amazing Return on investment!"
            />
            <ReviewCard
              name="Ayesha Khan"
              profession="Housewife"
              time={18}
              rating={5}
              message="I have made huge profits! All thanks to the lifetime support provided by Tradewise"
            />
            <ReviewCard
              name="Arjun Kumar"
              profession="Business Analyst"
              time={27}
              rating={4}
              message="Tradewise team did an amazing job with their free 2-hour Masterclass! It offers more value than many paid courses out there."
            />
          </>
        )}

        {type === CLASS_TYPE.BOOTCAMP ? (
          <div
            ref={formRef}
            className="md:hidden"
          >
            {/* @ts-ignore */}
            <BootcampForm bootcamp={data} />
          </div>
        ) : (
          <div
            ref={formRef}
            className="md:hidden"
          >
            <NewLeadForm
              data={data}
              scroll={scroll ? scroll : false}
              offerEndTime={offerEndTime}
            />
          </div>
        )}
      </div>
    </div>
  );
}
