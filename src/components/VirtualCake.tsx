"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { playBlowSound } from "./AudioSynth";

interface VirtualCakeProps {
  name: string;
}

export default function VirtualCake({ name }: VirtualCakeProps) {
  const [isBlown, setIsBlown] = useState(false);
  const [showWish, setShowWish] = useState(false);

  const handleBlow = () => {
    if (isBlown) return;

    // Play blow noise synth sound
    playBlowSound();

    setIsBlown(true);

    // Trigger sparkly gold/pink/white confetti
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.55 },
        colors: ["#ffd166", "#ffccd5", "#fff", "#ffe3e8", "#ffc09f"],
        scalar: 1.1,
      });
      setShowWish(true);
    }, 200);
  };

  const handleReset = () => {
    setIsBlown(false);
    setShowWish(false);
  };

  return (
    <div className="w-full bg-white/40 rounded-2xl p-6 border border-[#e0a96d]/20 text-center my-6 select-none animate-pop-in">
      <h3 className="font-script text-4.5xl text-[#b76e79] mb-1 select-none leading-none">
        Tiup Lilin Ulang Tahun 🎂
      </h3>
      <p className="text-xs text-neutral-500 mb-16 font-sans">
        {!isBlown
          ? `Ayo tiup lilinnya, ${name || "Wulan"}! (Klik apinya)`
          : "Yeyy! Selamat membuat permohonan! ✨"}
      </p>

      {/* Cake Container */}
      <div className="relative w-full max-w-[200px] mx-auto h-[160px] flex flex-col justify-end items-center mb-8">
        
        {/* Candle Stick & Flame */}
        <div className="absolute bottom-[114px] w-full left-0 z-20">
          
          {/* Candle stick */}
          <div className="w-2.5 h-12 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 rounded-t-sm mx-auto shadow-xs relative border border-[#e0a96d]/20">
            {/* Candle stripes */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.7)_4px,rgba(255,255,255,0.7)_8px)]" />
          </div>

          {/* Flame (Interactive) */}
          {!isBlown ? (
            <div
              onClick={handleBlow}
              className="w-4.5 h-7 bg-gradient-to-t from-amber-300 via-orange-400 to-red-500 rounded-[50%_50%_20%_20%] absolute top-[-26px] left-1/2 -translate-x-1/2 cursor-pointer select-none filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] hover:scale-125 transition active:scale-90"
              style={{
                animation: "flicker 0.6s infinite alternate ease-in-out",
                transformOrigin: "bottom center",
              }}
              title="Klik untuk meniup lilin!"
            />
          ) : (
            /* Smoke Effect */
            <div className="absolute top-[-28px] left-1/2 -translate-x-1/2 text-lg opacity-85 animate-smoke pointer-events-none">
              💨
            </div>
          )}
        </div>

        {/* Cake Layers */}
        {/* Top layer: Cream */}
        <div className="w-28 h-10 bg-gradient-to-b from-[#fdfbf7] to-[#f7f0e1] border-b-2 border-[#e0a96d]/20 rounded-t-md relative z-10">
          {/* Frosting drips */}
          <div className="absolute bottom-[-4px] left-2 w-3 h-4 bg-[#f7f0e1] rounded-full" />
          <div className="absolute bottom-[-6px] left-8 w-4 h-6 bg-[#f7f0e1] rounded-full" />
          <div className="absolute bottom-[-3px] left-16 w-3 h-4 bg-[#f7f0e1] rounded-full" />
          <div className="absolute bottom-[-5px] right-4 w-4.5 h-5.5 bg-[#f7f0e1] rounded-full" />
          {/* Sprinkles (Rose Gold & Pearl White) */}
          <div className="absolute top-2 left-4 w-1.5 h-1.5 bg-[#b76e79] rounded-full" />
          <div className="absolute top-3 left-14 w-1.5 h-1.5 bg-white rounded-full" />
          <div className="absolute top-1.5 right-6 w-1.5 h-1.5 bg-[#e8dbfc] rounded-full" />
        </div>

        {/* Middle layer: Soft Pink */}
        <div className="w-34 h-12 bg-gradient-to-b from-[#ffeef2] to-[#ffd6e0] border-b-2 border-[#ffd6e0]/30 relative z-5">
          {/* Frosting drips */}
          <div className="absolute bottom-[-4px] left-4 w-3.5 h-5 bg-[#ffd6e0] rounded-full" />
          <div className="absolute bottom-[-5px] right-10 w-4 h-6 bg-[#ffd6e0] rounded-full" />
          <div className="absolute bottom-[-3px] right-2 w-3 h-4 bg-[#ffd6e0] rounded-full" />
          {/* Sprinkles */}
          <div className="absolute top-4 left-6 w-1.5 h-1.5 bg-white rounded-full" />
          <div className="absolute top-2.5 left-16 w-1.5 h-1.5 bg-[#b76e79] rounded-full" />
          <div className="absolute top-5 right-8 w-1.5 h-1.5 bg-[#e8dbfc] rounded-full" />
        </div>

        {/* Bottom layer: Lavender */}
        <div className="w-40 h-14 bg-gradient-to-b from-[#f3eefe] to-[#e8dbfc] border-b-2 border-[#e8dbfc]/30 rounded-b-md relative z-0">
          {/* Frosting drips */}
          <div className="absolute bottom-[-3px] left-10 w-4 h-5 bg-[#e8dbfc] rounded-full" />
          <div className="absolute bottom-[-5px] left-20 w-3.5 h-6 bg-[#e8dbfc] rounded-full" />
          <div className="absolute bottom-[-4px] right-12 w-4 h-5 bg-[#e8dbfc] rounded-full" />
          {/* Sprinkles */}
          <div className="absolute top-4 left-4 w-1.5 h-1.5 bg-white rounded-full" />
          <div className="absolute top-6 left-12 w-1.5 h-1.5 bg-[#b76e79] rounded-full" />
          <div className="absolute top-3 right-6 w-1.5 h-1.5 bg-[#fdfbf7] rounded-full" />
        </div>

        {/* Cake Plate: Gold/Rose-Gold accent */}
        <div className="w-48 h-3.5 bg-gradient-to-r from-[#ebd6b2] via-[#e0a96d] to-[#bda177] border border-[#d4af37]/20 rounded-full shadow-md z-0" />
      </div>

      {/* Wish display panel */}
      <div className="min-h-[100px] flex items-center justify-center px-4 mt-6">
        {showWish ? (
          <div className="bg-white/90 px-5 py-4 rounded-2xl border border-[#e0a96d]/30 shadow-md animate-pop-in text-sm text-neutral-700 leading-relaxed font-sans max-w-sm">
            <span className="block text-[11px] text-[#d4af37] font-bold tracking-wider mb-1.5 uppercase">
              Permohonan Diusulkan! 💫
            </span>
            <p className="mb-3 font-semibold text-[#b76e79] text-base">
              Selamat Ulang Tahun, {name || "Wulan"}! 🎂🥳
            </p>
            <p className="text-xs text-neutral-500 italic">
              "Semoga segala doa yang kamu bisikkan dalam hati barusan dikabulkan oleh semesta dan membawamu ke hari-hari yang penuh tawa bahagia. Amin! 💖"
            </p>
            <button
              onClick={handleReset}
              className="mt-4 text-[10px] text-[#b76e79] hover:text-[#a05662] font-bold border-b border-dashed border-[#b76e79]/45 cursor-pointer"
            >
              Nyalakan Lilin Lagi
            </button>
          </div>
        ) : (
          <p className="text-xs text-neutral-400 italic font-sans">
            Klik apinya untuk meniup lilin dan membuat permohonan...
          </p>
        )}
      </div>
    </div>
  );
}
