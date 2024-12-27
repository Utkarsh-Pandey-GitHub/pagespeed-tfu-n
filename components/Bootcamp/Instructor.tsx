import { Teacher } from "@/types/bootcamp-slug";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { PlayCircleIcon, UserIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function Instructor({ teacher }: { teacher: Teacher }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4 gap-x-8">
        {teacher.photo && (
          <div className="bg-orange-100 border border-black rounded-full">
            <Image
              src={teacher.photo}
              alt={`${teacher.name}'s profile`}
              className="rounded-full object-cover mix-blend-darken aspect-square size-32 md:size-48 lg:size-64"
              width={200}
              height={200}
            />
          </div>
        )}
        <div className="space-y-4 flex-0">
          <div>
            <h3 className="text-2xl font-semibold">{teacher?.name}</h3>
            <p className="text-sm text-muted-foreground">Trading Expert</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-x-8 gap-y-2">
            {teacher.achievements?.rating && (
              <AchievementItem
                icon={
                  <StarIcon className="w-5 h-5 text-orange-500 fill-current" />
                }
                text={`${teacher.achievements?.rating}/5 Stars`}
              />
            )}
            {teacher.achievements?.reviews && (
              <AchievementItem
                icon={
                  <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5 text-gray-900 fill-blue-500" />
                }
                text={`${teacher.achievements?.reviews} Reviews`}
              />
            )}
            {teacher.achievements?.students && (
              <AchievementItem
                icon={
                  <UserIcon className="w-5 h-5 text-purple-500 fill-current" />
                }
                text={`${teacher.achievements?.students} Students`}
              />
            )}
            {teacher.achievements?.courses && (
              <AchievementItem
                icon={
                  <PlayCircleIcon className="w-5 h-5 text-white fill-orange-500" />
                }
                text={`${teacher.achievements?.courses} Course${
                  teacher.achievements?.courses &&
                  teacher.achievements?.courses > 1
                    ? "s"
                    : ""
                }`}
              />
            )}
          </div>
        </div>
      </div>
      {teacher?.bio && (
        <div>
          <h4 className="text-xl font-semibold mb-2">Introduction</h4>
          <p className="text-muted-foreground text-justify">{teacher.bio}</p>
        </div>
      )}
    </section>
  );
}

const AchievementItem = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <p className="text-md text-muted-foreground">{text}</p>
    </div>
  );
};
