import { Module } from "@/types/bootcamp-slug";
import Image from "next/image";
import React from "react";

export default function Curriculum({ Modules }: { Modules: Module[] }) {
  return (
    <section className="space-y-8">
      {Modules?.map((session, index) => {
        return (
          <div
            className="flex flex-col justify-start items-start w-full relative"
            key={session.id}
          >
            <div className="flex flex-row justify-start items-start gap-4 w-full">
              <Image
                src="/tradewise/pointer.svg"
                alt="pointer"
                width={35}
                height={35}
                className="relative top-12"
              />
              <div className="bg-gray-50 shadow p-4 rounded-2xl flex flex-col justify-start items-start gap-2 w-full">
                <h4 className="text-blue-900 font-semibold">{session.title}</h4>
                <p>{session.description}</p>
              </div>
            </div>
            {index < Modules?.length - 1 && (
              <div className="border-l-2 border-dashed border-gray-300 h-full absolute left-[0.95rem] top-[5rem] z-0" />
            )}
          </div>
        );
      })}
      {Modules?.length === 0 && (
        <p className="font-medium">Curriculum will be updated soon</p>
      )}
    </section>
  );
}
