"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { launchConfetti, fireMoreHearts } from "@/components/Confetti";
import { BirthdayAudioPlayer, birthdaySong } from "@/components/AudioSynth";
import PolaroidGallery from "@/components/PolaroidGallery";
import WishBalloons from "@/components/WishBalloons";
import VirtualCake from "@/components/VirtualCake";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"letter" | "gallery" | "balloons" | "cake">("letter");
  
  // Personalization State - Empty by default
  const [nameInput, setNameInput] = useState("");
  const [name, setName] = useState("");

  // Countdown & Hydration State
  const isMounted = useSyncExternalStore(
    (cb) => () => cb(),
    () => true,
    () => false
  );
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number | null>(null);
  
  // Floating elements state
  type Decoration = { id: number; char: string; left: number; delay: number; duration: number; size: number };
  const [decorations] = useState<Decoration[]>(() => {
    const types = ["✨", "🌸", "💌", "BALLOON_PINK", "BALLOON_LAVENDER"];
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      char: types[i % types.length],
      left: Math.random() * 90 + 5,
      delay: Math.random() * 7,
      duration: Math.random() * 8 + 8,
      size: Math.random() * 12 + 16,
    }));
  });
  
  const playerRef = useRef<BirthdayAudioPlayer | null>(null);

  // Initialize floating decorations and countdown timer
  useEffect(() => {
    const target = new Date("2026-08-26T00:00:00+07:00").getTime();
    const updateTimer = () => {
      const now = new Date().getTime();
      setTimeLeft(target - now);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    // Initialize audio player
    const player = new BirthdayAudioPlayer();
    player.setCallbacks(
      (index) => {
        setCurrentLyricIndex(index);
      },
      () => {
        setIsPlaying(false);
        setCurrentLyricIndex(null);
      }
    );
    playerRef.current = player;

    return () => {
      clearInterval(interval);
      player.stop();
    };
  }, []);

  const handleOpenSurprise = async () => {
    if (!nameInput.trim()) {
      alert("Tulis nama kamu dulu dong, Tuan Putri! 🌸");
      return;
    }
    const finalName = nameInput.trim();
    setName(finalName);
    setIsOpen(true);
    
    // Trigger confetti explosion
    launchConfetti();

    // Start synthesized music
    if (playerRef.current) {
      await playerRef.current.start();
      setIsPlaying(true);
    }
  };

  const handleToggleMusic = async () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.stop();
      setIsPlaying(false);
      setCurrentLyricIndex(null);
    } else {
      await playerRef.current.start();
      setIsPlaying(true);
    }
  };

  const handleHujanCinta = () => {
    fireMoreHearts();
  };

  // Get current active lyric text
  const currentLyric =
    currentLyricIndex !== null && birthdaySong[currentLyricIndex]
      ? birthdaySong[currentLyricIndex].lyric
      : "";

  return (
    <main className="flex-1 w-full min-h-screen flex items-center justify-center p-4 relative overflow-hidden select-none">
      
      {/* Floating Background Elements */}
      {decorations.map((dec) => (
          <span
            key={dec.id}
            suppressHydrationWarning
            className="absolute bottom-[-140px] pointer-events-none opacity-60 z-0 select-none animate-float-up"
            style={{
              left: `${dec.left}%`,
              animationDelay: `${dec.delay}s`,
              animationDuration: `${dec.duration}s`,
            }}
          >
            {dec.char === "BALLOON_PINK" || dec.char === "BALLOON_LAVENDER" ? (
            <div className={`relative flex flex-col items-center ${dec.char === "BALLOON_PINK" ? "text-pink-300" : "text-purple-300"}`}>
              <div className={`w-10 h-13 rounded-t-full rounded-b-[40px] backdrop-blur-[1px] border flex items-center justify-center relative ${dec.char === "BALLOON_PINK" ? "bg-pink-400/20 border-pink-300/40 shadow-[inset_-3px_-3px_8px_rgba(244,63,94,0.15)]" : "bg-purple-400/20 border-purple-300/40 shadow-[inset_-3px_-3px_8px_rgba(168,85,247,0.15)]"}`}>
                <div className="absolute top-1.5 left-2 w-2 h-3.5 bg-white/40 rounded-full rotate-[15deg]" />
                <span className="text-[10px] opacity-70">{dec.char === "BALLOON_PINK" ? "💖" : "✨"}</span>
                <div className="w-1.5 h-1.5 bg-current opacity-50 transform rotate-45 absolute bottom-[-1px]" />
              </div>
              <div className="w-[1px] h-10 bg-gradient-to-b from-[#e0a96d]/45 to-transparent" />
            </div>
          ) : (
            <span style={{ fontSize: `${dec.size}px` }}>{dec.char}</span>
          )}
          </span>
      ))}

      {/* Floating Music Chime Controller */}
      {isOpen && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-[#e0a96d]/30 transition hover:scale-105 select-none">
          {isPlaying && (
            <div className="flex gap-[2px] items-end h-3 w-4 mr-1">
              <span className="w-[3px] bg-[#b76e79] rounded-xs animate-eq-1 origin-bottom h-full" style={{ animationDelay: "0.15s" }} />
              <span className="w-[3px] bg-[#b76e79] rounded-xs animate-eq-2 origin-bottom h-full" style={{ animationDelay: "0.35s" }} />
              <span className="w-[3px] bg-[#b76e79] rounded-xs animate-eq-3 origin-bottom h-full" style={{ animationDelay: "0s" }} />
            </div>
          )}
          <button
            onClick={handleToggleMusic}
            className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-xs cursor-pointer shadow-inner transition-all ${
              isPlaying 
                ? "bg-[#b76e79] text-white animate-spin-slow" 
                : "bg-[#ffeef2] text-[#b76e79] hover:bg-[#ffd6e0]"
            }`}
            title={isPlaying ? "Mute Musik" : "Putar Musik"}
          >
            {isPlaying ? "🎵" : "🔇"}
          </button>
        </div>
      )}

      {/* Lyric Bubble Player */}
      {isOpen && isPlaying && currentLyric && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#b76e79] text-white font-sans px-5 py-2.5 rounded-full shadow-lg border-2 border-white text-xs font-bold tracking-wider animate-bounce flex items-center gap-1.5 whitespace-nowrap">
          <span>🎵</span>
          <span>{currentLyric}</span>
          <span>🎵</span>
        </div>
      )}

      {/* Main card container or Countdown Card */}
      {!isMounted ? (
        /* Empty container placeholder to avoid layout layout shift and hydration mismatch */
        <div className="w-full max-w-md h-[400px]" />
      ) : timeLeft > 0 ? (
        /* ================= COUNTDOWN CARD ================= */
        <div className="w-full max-w-md bg-white/75 backdrop-blur-xl border-gold-soft rounded-[32px] shadow-[0_20px_50px_rgba(183,110,121,0.12)] p-8 text-center relative z-10 transition-all">
          <span className="inline-block bg-[#b76e79] text-white text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-5 font-sans">
            ⏳ Segera Hadir ⏳
          </span>
          <h1 className="font-script text-4.5xl text-[#b76e79] leading-tight mb-2 select-none">
            Sabar yaa Tuan Putri cantiknya aku... 🌸
          </h1>
          <p className="text-xs font-sans text-neutral-500 mb-8 max-w-xs mx-auto leading-relaxed">
            Kejutan ulang tahun buat Wulan Gartifani baru kebuka otomatis pas jam 12 malem teng (00:00 WIB) nanti yaa. Jadi, jangan tidur cepet-cepet yaa sayang! ⏰✨
          </p>
          
          {/* Countdown Clock */}
          <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto mb-8 font-sans">
            <div className="bg-white/60 border border-[#e0a96d]/20 rounded-2xl p-3 shadow-inner">
              <span className="block text-3xl font-bold text-[#b76e79] tabular-nums">
                {String(Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)))).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Jam</span>
            </div>
            <div className="bg-white/60 border border-[#e0a96d]/20 rounded-2xl p-3 shadow-inner">
              <span className="block text-3xl font-bold text-[#b76e79] tabular-nums">
                {String(Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)))).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Menit</span>
            </div>
            <div className="bg-white/60 border border-[#e0a96d]/20 rounded-2xl p-3 shadow-inner">
              <span className="block text-3xl font-bold text-[#b76e79] tabular-nums">
                {String(Math.max(0, Math.floor((timeLeft % (1000 * 60)) / 1000))).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Detik</span>
            </div>
          </div>

          <p className="text-[11px] text-[#b76e79]/70 font-semibold font-sans animate-pulse">
            Ditunggu yaa, ga sabar pengen kamu liat kado kecil yang udah aku bikin khusus buat kamu! 🥰
          </p>
        </div>
      ) : (
        /* ================= MAIN CARD CONTAINER ================= */
        <div className="w-full max-w-md bg-white/75 backdrop-blur-xl border-gold-soft rounded-[32px] shadow-[0_20px_50px_rgba(183,110,121,0.12)] p-6 md:p-8 text-center relative z-10 transition-all duration-500 transform hover:shadow-[0_25px_60px_rgba(183,110,121,0.16)] overflow-hidden">
          
          {/* Corner Peony/Rose SVG Decorations (Clean elegant minimal line art) */}
          <div className="absolute top-2 left-2 w-14 h-14 pointer-events-none opacity-25 select-none z-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="#b76e79" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M12 2C11.5 5 9 7 9 10C9 13 11 15 12 15C13 15 15 13 15 10C15 7 12.5 5 12 2Z" />
              <path d="M12 15C12 18 10 20 8 22" />
              <path d="M12 15C12 18 14 20 16 22" />
              <path d="M9 10C7 9.5 5 7 5 5" />
              <path d="M15 10C17 9.5 19 7 19 5" />
            </svg>
          </div>
          
          <div className="absolute bottom-2 right-2 w-14 h-14 pointer-events-none opacity-25 select-none z-0 transform rotate-180">
            <svg viewBox="0 0 24 24" fill="none" stroke="#b76e79" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M12 2C11.5 5 9 7 9 10C9 13 11 15 12 15C13 15 15 13 15 10C15 7 12.5 5 12 2Z" />
              <path d="M12 15C12 18 10 20 8 22" />
              <path d="M12 15C12 18 14 20 16 22" />
              <path d="M9 10C7 9.5 5 7 5 5" />
              <path d="M15 10C17 9.5 19 7 19 5" />
            </svg>
          </div>

          {!isOpen ? (
            /* ================= WELCOME SCREEN (GIFT CLOSED) ================= */
            <div className="py-4 flex flex-col items-center animate-pop-in relative z-10">
              <span className="inline-block bg-[#b76e79] text-white text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest shadow-xs uppercase mb-5 select-none font-sans">
                🌸 A Special Surpise 🌸
              </span>
              
              <h1 className="font-script text-5.5xl text-[#b76e79] leading-none mb-1 select-none filter drop-shadow-xs">
                Selamat Ulang Tahun
              </h1>
              <p className="text-xs font-semibold font-sans text-neutral-500 mb-8 tracking-wider">
                UNTUK TUAN PUTRI KESAYANGAN 👑
              </p>

              {/* Personalized Name Input */}
              <div className="w-full max-w-[240px] mb-8 select-none font-sans" suppressHydrationWarning>
                <label className="block text-[10px] text-[#b76e79] font-bold uppercase mb-1.5 tracking-wider">
                  Siapa Nama Tuan Putri? 🌸
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Tulis namamu disini..."
                  maxLength={20}
                  className="w-full input-gold-soft rounded-2xl px-4 py-2.5 text-center text-sm font-semibold placeholder-[#b76e79]/35 text-[#b76e79] shadow-xs"
                  suppressHydrationWarning
                />
              </div>

              {/* Bouncing Interactive Gift Envelope */}
              <div
                onClick={handleOpenSurprise}
                className="w-36 h-36 bg-gradient-to-br from-[#ffd6e0] to-[#b76e79] rounded-full flex items-center justify-center text-6xl cursor-pointer shadow-[0_12px_28px_rgba(183,110,121,0.3)] transition-all duration-300 hover:scale-108 hover:rotate-3 hover:from-[#ffd6e0]/90 hover:to-[#b76e79]/90 active:scale-95 active:rotate-[-3deg] select-none group relative border border-[#e0a96d]/25"
                style={{
                  animation: "pulse-slow 2.2s infinite ease-in-out",
                }}
              >
                {/* Pulsing ring */}
                <div className="absolute inset-0 rounded-full bg-[#b76e79]/20 scale-110 group-hover:scale-120 animate-ping opacity-35 duration-1000 pointer-events-none" />
                🎁
              </div>

              <p className="text-[11px] text-neutral-400 font-semibold font-sans mt-8 animate-bounce">
                Buka kado untuk kejutan manis dari hati! ✨
              </p>
            </div>
          ) : (
            /* ================= OPENED SCREEN (MAIN WEB APP) ================= */
            <div className="animate-pop-in relative z-10">
              <span className="inline-block bg-[#b76e79] text-white text-[9px] font-bold px-3.5 py-1 rounded-full tracking-wider shadow-xs uppercase mb-1 font-sans">
                ✨ UNTUK {name.toUpperCase()} ✨
              </span>
              
              <h1 className="font-script text-5xl text-[#b76e79] leading-none mb-1 select-none">
                Happy Birthday, {name}! 🎉
              </h1>
              <p className="text-[10px] text-neutral-400 font-semibold font-sans tracking-wide mb-6">
                PESAN INDAH DI HARI LAHIRMU 👑
              </p>

              {/* Tabs Selector */}
              <div className="grid grid-cols-4 bg-neutral-100/70 rounded-2xl p-1 mb-6 border border-neutral-200/30 select-none text-[11px] font-sans">
                <button
                  onClick={() => setActiveTab("letter")}
                  className={`py-2.5 font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "letter"
                      ? "bg-white text-[#b76e79] shadow-sm border border-[#e0a96d]/20"
                      : "text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  💌 Surat
                </button>
                <button
                  onClick={() => setActiveTab("gallery")}
                  className={`py-2.5 font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "gallery"
                      ? "bg-white text-[#b76e79] shadow-sm border border-[#e0a96d]/20"
                      : "text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  📸 Memori
                </button>
                <button
                  onClick={() => setActiveTab("balloons")}
                  className={`py-2.5 font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "balloons"
                      ? "bg-white text-[#b76e79] shadow-sm border border-[#e0a96d]/20"
                      : "text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  🎈 Harapan
                </button>
                <button
                  onClick={() => setActiveTab("cake")}
                  className={`py-2.5 font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "cake"
                      ? "bg-white text-[#b76e79] shadow-sm border border-[#e0a96d]/20"
                      : "text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  🎂 Lilin
                </button>
              </div>

              {/* Active Content rendering */}
              <div className="min-h-[300px] flex items-center justify-center transition-all duration-300">
                
                {activeTab === "letter" && (
                  /* TAB 1: CUTE LETTER */
                  <div className="bg-[#fdfbf7]/60 border border-[#e0a96d]/20 rounded-2xl p-5 text-left w-full shadow-inner animate-pop-in">
                    <h3 className="font-script text-3.5xl text-[#b76e79] mb-3 text-center leading-none">
                      Untuk Wulan Kesayanganku 💖
                    </h3>
                    
                    <div className="text-[13.5px] text-neutral-600 space-y-3 font-sans leading-relaxed text-justify px-1">
                      <p>
                        Selamat ulang tahun yaa sayangku, <strong>{name}</strong>. Hari ini hari spesial kamu, dan aku bersyukur banget bisa nemenin kamu di usia yang baru ini.
                      </p>
                      <p>
                        Semoga apa yang kamu semogakan cepet terwujud yaa. Mulai dari rintisan bisnis bunga <em>twfloristt</em> kamu dari rumah biar makin laris manis, rezeki kita yang makin lancar, segala urusan kamu dipermudah, dan yang paling penting... semoga kita segera halal dan menikah secepatnya. Amin! 💍💐
                      </p>
                      <p>
                        Oh iya, di umur yang baru ini, semoga pawang ngambeknya makin pinter yaa, terutama pas cuaca lagi panas-panasnya wkwk. Aku paham banget kok kalau cuaca gerah dikit bawaannya emosi terus ngedumel mulu. Tapi gak apa-apa, se-ngambek atau se-marah apapun kamu pas lagi gerah, kamu tetep jadi Tuan Putri paling gemes dan kesayangan aku selamanya.
                      </p>
                      <p>
                        Makasih ya udah selalu jadi sosok penyayang yang bikin hari-hariku penuh warna. Tetap jadi Wulan yang ceria yaa (asal ac jangan mati aja pas mati lampu wkwk), <em>I love you to the moon and back!</em> 💕
                      </p>
                    </div>

                    <div className="mt-5 text-center">
                      <button
                        onClick={handleHujanCinta}
                        className="gift-btn w-full bg-gradient-to-r from-[#b76e79] to-[#e0a96d] border-none text-white font-bold py-2.5 px-6 rounded-full cursor-pointer shadow-md hover:scale-103 active:scale-97 transition-all text-xs font-sans tracking-wide"
                      >
                        Hujan Cinta Lagi! 💖
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "gallery" && (
                  /* TAB 2: POLAROID GALLERY */
                  <div className="w-full animate-pop-in">
                    <PolaroidGallery />
                  </div>
                )}

                {activeTab === "balloons" && (
                  /* TAB 3: POP BALLOONS Harapan */
                  <div className="w-full animate-pop-in">
                    <WishBalloons />
                  </div>
                )}

                {activeTab === "cake" && (
                  /* TAB 4: VIRTUAL CAKE */
                  <div className="w-full animate-pop-in">
                    <VirtualCake name={name} />
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
