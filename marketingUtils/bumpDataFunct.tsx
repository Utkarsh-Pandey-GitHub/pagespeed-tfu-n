import { Bot, Video } from "lucide-react";

export default function getOffers(slug: string) {
  switch (slug) {
   
    default:
      return [{
        id: 1,
        name: "Lifetime Access to Class Recordings",
        price: 49,
        description: [
          "Revisit lessons anytime, sharpen your skills, and never miss a detail!"
        ],
        icon: Video
      },
      {
        id: 2,
        name: "ChatGPT Prompts for Stock Analysis",
        price: 49,
        description: [
          "Get customized ChatGPT prompts designed to analyze stocks, identify trends, and make informed trading decisions."
        ],
        icon: Bot
      }];
  }
}