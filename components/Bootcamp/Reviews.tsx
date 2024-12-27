import { BootcampReviews } from "@/utils/reviews";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Dot, Star } from "lucide-react";

const defaultReviews = {
  name: [
    {
      name: "Rohan Patel",
      profession: "Business Man",
      rating: 4.5,
      days: 6,
    },
    {
      name: "Ayesha Khan",
      profession: "Housewife",
      rating: 5,
      days: 18,
    },
    {
      name: "Arjun Kumar",
      profession: "Business Analyst",
      rating: 4,
      days: 27,
    },
  ],
  review: [
    "I have been learning from Tradewise for 2 years. Amazing Return on investment!",
    "I have made huge profits! All thanks to the lifetime support provided by Tradewise",
    "Tradewise team did an amazing job with their free 2-hour Masterclass! It offers more value than many paid courses out there.",
  ],
};

export default function Reviews({ slug }: { slug: string }) {
  let reviews = BootcampReviews.filter(
    (review) => review.bootcamp === slug
  ).map((review) => review.reviews)[0];

  if (!reviews || reviews.review.length === 0) {
    reviews = defaultReviews;
  }

  return (
    <section className="space-y-4">
      {reviews?.name.map((review, index) => (
        <ReviewCard
          key={index}
          details={review}
          review={reviews.review[index]}
        />
      ))}
    </section>
  );
}

const ReviewCard = ({
  details,
  review,
}: {
  details: { name: string; profession: string; rating: number; days: number };
  review: string;
}) => {
  return (
    <Card className="border-none shadow-xl">
      <CardHeader className="flex-row items-end gap-4">
        <div className="size-10 rounded-full text-blue-900 text-xl bg-blue-200 font-bold grid place-items-center">
          <div>{details.name[0]}</div>
        </div>
        <div className="gap-1">
          <CardTitle className="text-xl tracking-normal">
            {details.name}
            <CardDescription className="inline ml-1 font-medium">
              ({details.profession})
            </CardDescription>
          </CardTitle>
          <div className="flex">
            {Array.from({ length: details.rating }).map((_, index) => (
              <Star
                key={index}
                size={16}
                className="text-yellow-500 fill-current"
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p>{review}</p>
      </CardContent>
    </Card>
  );
};
