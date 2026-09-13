"use client";

import { useState } from "react";
import { popBalloonConfetti } from "./Confetti";
import { getAudioContextClass } from "./AudioSynth";

interface Balloon {
  id: number;
  color: string;
  borderColor: string;
  shadowColor: string;
  wish: string;
  label: string;
}

const initialBalloons: Balloon[] = [
  {
    id: 1,
    color: "bg-rose-400",
    borderColor: "border-rose-300",
    shadowColor: "shadow-rose-300/40",
    wish: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 💍💖",
    label: "Lorem 1 💍",
  },
  {
    id: 2,
    color: "bg-amber-400",
    borderColor: "border-amber-300",
    shadowColor: "shadow-amber-300/40",
    wish: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor 🌸💐",
    label: "Lorem 2 🌸",
  },
  {
    id: 3,
    color: "bg-emerald-400",
    borderColor: "border-emerald-300",
    shadowColor: "shadow-emerald-300/40",
    wish: "Lorem ipsum dolor sit amet, consectetur adipiscing elit 💰✨",
    label: "Lorem 3 💰",
  },
  {
    id: 4,
    color: "bg-sky-400",
    borderColor: "border-sky-300",
    shadowColor: "shadow-sky-300/40",
    wish: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed 🍀",
    label: "Lorem 4 ✨",
  },
  {
    id: 5,
    color: "bg-purple-400",
    borderColor: "border-purple-300",
    shadowColor: "shadow-purple-300/40",
    wish: "Lorem ipsum dolor sit amet, consectetur adipiscing elit 😊💕",
    label: "Lorem 5 😊",
  },
];

export default function WishBalloons() {
  const [poppedIds, setPoppedIds] = useState<number[]>([]);
  const [activeWish, setActiveWish] = useState<string | null>(null);

  const playPopSound = () => {
    try {
      const AudioContextClass = getAudioContextClass();
      if (!AudioContextClass) return;

      const audioCtx = new AudioContextClass();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = "sine";
      // Fast sweep from 800Hz to 150Hz for a bubble pop sound
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.08);

      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);

      setTimeout(() => {
        audioCtx.close();
      }, 100);
    } catch (e) {
      console.warn("Failed to play pop sound", e);
    }
  };

  const handlePop = (id: number, e: React.MouseEvent, wish: string) => {
    if (poppedIds.includes(id)) {
      setActiveWish(wish);
      return;
    }

    playPopSound();

    // Calculate click coordinates for confetti origin
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    popBalloonConfetti(x, y);

    setPoppedIds((prev) => [...prev, id]);
    setActiveWish(wish);
  };

  const allPopped = poppedIds.length === initialBalloons.length;

  return (
    <div className="w-full bg-rose-50/50 rounded-2xl p-5 border border-rose-100/60 text-center my-6">
      <h3 className="font-sacramento text-3xl text-rose-500 font-bold mb-1">
        Lorem Ipsum 🎈
      </h3>
      <p className="text-xs text-neutral-500 mb-6">
        Lorem ipsum dolor sit amet consectetur!
      </p>

      {/* Balloon board */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-8 my-4">
        {initialBalloons.map((balloon) => {
          const isPopped = poppedIds.includes(balloon.id);

          return (
            <div
              key={balloon.id}
              className="flex flex-col items-center select-none"
            >
              {/* Balloon / Pop effect wrapper */}
              <div className="relative h-28 w-16 flex items-center justify-center">
                {!isPopped ? (
                  // Active Balloon
                  <button
                    onClick={(e) => handlePop(balloon.id, e, balloon.wish)}
                    className={`w-14 h-18 rounded-t-full rounded-b-[45px] border ${balloon.borderColor} ${balloon.color} shadow-lg ${balloon.shadowColor} cursor-pointer hover:scale-110 active:scale-95 active:rotate-3 transition duration-300 flex flex-col justify-end items-center pb-2`}
                    style={{
                      animation: `float-subtle ${2.5 + balloon.id * 0.3}s ease-in-out infinite alternate`,
                    }}
                  >
                    {/* Balloon knot */}
                    <div className="w-2.5 h-2.5 bg-current opacity-80 border-t border-white/20 transform rotate-45 mb-[-2px] text-inherit" />
                    {/* Balloon string */}
                    <div className="w-[1px] h-8 bg-neutral-400/50 absolute top-[70px] left-1/2 -translate-x-1/2" />
                  </button>
                ) : (
                  // Popped State / Thread
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-rose-500 font-bold text-xs animate-ping absolute">
                      💥
                    </span>
                    <span className="text-xl filter grayscale opacity-40">🎈</span>
                    <div className="w-[1px] h-10 bg-neutral-400/30 mt-1" />
                  </div>
                )}
              </div>

              {/* Balloon Text Label */}
              <button
                onClick={(e) => handlePop(balloon.id, e, balloon.wish)}
                className={`text-[10px] mt-1 px-2 py-0.5 rounded-full border transition cursor-pointer font-sans ${
                  isPopped
                    ? "bg-neutral-100 text-neutral-400 border-neutral-200"
                    : "bg-white text-neutral-600 hover:text-rose-500 border-rose-200"
                }`}
              >
                {balloon.label}
              </button>
            </div>
          );
        })}
      </div>

      {/* Wish display board */}
      <div className="min-h-[80px] flex items-center justify-center px-4 mt-6">
        {activeWish ? (
          <div className="bg-white px-4 py-3 rounded-xl border border-rose-100/60 shadow-sm animate-pop-in text-sm text-neutral-700 leading-relaxed font-sans max-w-sm">
            <span className="block text-[10px] text-rose-400 font-bold tracking-wider mb-0.5 uppercase">
              Lorem Ipsum Dolor ✨
            </span>
            {activeWish}
          </div>
        ) : (
          <p className="text-xs text-neutral-400 italic">
            Lorem ipsum dolor...
          </p>
        )}
      </div>

      {allPopped && (
        <div className="mt-4 text-xs text-emerald-600 font-bold font-sans animate-bounce">
          🎉 Lorem ipsum dolor sit amet, consectetur 💖
        </div>
      )}
    </div>
  );
}
