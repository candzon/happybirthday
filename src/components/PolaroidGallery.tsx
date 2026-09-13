"use client";

import React, { useState } from "react";

interface PolaroidItem {
  src: string;
  type: "image" | "video";
  title: string;
  description: string;
  rotation: string;
}

const memories: PolaroidItem[] = [
  {
    src: "/assets/senyum-manis.jpeg",
    type: "image",
    title: "Lorem Ipsum 1 ✨",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    rotation: "-rotate-2",
  },
  {
    src: "/assets/momen-berdua-1.mp4",
    type: "video",
    title: "Lorem Ipsum 2 💖",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed.",
    rotation: "rotate-3",
  },
  {
    src: "/assets/momen-berdua-2.jpeg",
    type: "image",
    title: "Lorem Ipsum 3 🧁",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.",
    rotation: "-rotate-1",
  },
  {
    src: "/assets/candid-cantik.jpeg",
    type: "image",
    title: "Lorem Ipsum 4 🌸",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit tempor.",
    rotation: "rotate-2",
  },
];

export default function PolaroidGallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % memories.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  return (
    <div className="w-full max-w-sm mx-auto my-6 font-sans">
      <h3 className="font-script text-4.5xl text-[#b76e79] text-center mb-4 leading-none select-none">
        Lorem Ipsum Dolor ✨
      </h3>

      <div className="relative h-[340px] flex items-center justify-center">
        {memories.map((item, index) => {
          const isSelected = index === activeIndex;
          const isPrev = (index === activeIndex - 1) || (activeIndex === 0 && index === memories.length - 1);
          const isNext = (index === activeIndex + 1) || (activeIndex === memories.length - 1 && index === 0);

          let positionClass = "opacity-0 scale-75 pointer-events-none z-0";
          if (isSelected) {
            positionClass = "opacity-100 scale-100 z-25 translate-x-0";
          } else if (isPrev) {
            positionClass = "opacity-40 scale-90 z-10 -translate-x-12 rotate-[-6deg]";
          } else if (isNext) {
            positionClass = "opacity-40 scale-90 z-10 translate-x-12 rotate-[6deg]";
          }

          return (
            <div
              key={index}
              className={`absolute transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) w-64 bg-white p-4 pb-6 rounded-sm shadow-xl border border-neutral-100/60 ${positionClass} ${
                isSelected ? item.rotation : ""
              }`}
            >
              {/* Push Pin Decoration */}
              <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-30 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C10.8954 2 10 2.89543 10 4V6.17071C8.83578 6.58254 8 7.69378 8 9V11H7C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13H11V20C11 20.5523 11.4477 21 12 21C12.5523 21 13 20.5523 13 20V13H17C17.5523 13 18 12.5523 18 12C18 11.4477 17.5523 11 17 11H16V9C16 7.69378 15.1642 6.58254 14 6.17071V4C14 2.89543 13.1046 2 12 2Z" fill="#b76e79" />
                  <circle cx="12" cy="5" r="2" fill="#ffe3e8" />
                </svg>
              </div>

              {/* Polaroid Photo Frame */}
              <div className="w-full aspect-square bg-neutral-50 rounded-xs flex flex-col items-center justify-center relative overflow-hidden select-none border border-neutral-200/30">
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10 pointer-events-none" />
              </div>

              {/* Caption */}
              <div className="mt-4 text-center select-text">
                <h4 className="font-script text-3.5xl text-[#b76e79] font-bold leading-tight">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-500 font-sans mt-1 px-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between px-8 mt-4 select-none">
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full bg-white/70 hover:bg-rose-50 border border-[#b76e79]/30 text-[#b76e79] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm font-bold text-lg cursor-pointer"
          title="Sebelumnya"
        >
          ←
        </button>

        {/* Dot Indicators */}
        <div className="flex gap-2">
          {memories.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === activeIndex ? "w-6 bg-[#b76e79]" : "w-2.5 bg-[#b76e79]/30 hover:bg-[#b76e79]/60"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full bg-white/70 hover:bg-rose-50 border border-[#b76e79]/30 text-[#b76e79] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm font-bold text-lg cursor-pointer"
          title="Selanjutnya"
        >
          →
        </button>
      </div>
    </div>
  );
}
