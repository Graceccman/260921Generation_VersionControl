import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  RotateCw,
  X,
  Navigation,
  Footprints,
  Star,
  CloudRain,
  Dices,
  Flame,
  Award
} from 'lucide-react';
import type { Restaurant } from '../types/restaurant';

export interface DecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurants?: Restaurant[];
  availableRestaurants?: Restaurant[];
  onSelectRestaurant?: (restaurant: Restaurant) => void;
}

export const DecisionModal: React.FC<DecisionModalProps> = ({
  isOpen,
  onClose,
  restaurants,
  availableRestaurants,
  onSelectRestaurant,
}) => {
  const pool = availableRestaurants || restaurants || [];
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [displayIndex, setDisplayIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const availableCount = pool.length;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f97316', '#eab308', '#ec4899', '#06b6d4', '#10b981']
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.7 },
          colors: ['#ff5722', '#ffeb3b', '#4caf50']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.7 },
          colors: ['#e91e63', '#9c27b0', '#00bcd4']
        });
      }, 250);
    } catch (e) {
      console.error('Confetti animation error:', e);
    }
  };

  const startRoulette = () => {
    if (availableCount === 0 || isSpinning) return;

    setIsSpinning(true);

    const winnerIdx = Math.floor(Math.random() * availableCount);
    let current = Math.floor(Math.random() * availableCount);
    let speed = 40;
    let iterations = 0;
    const totalIterations = 28 + Math.floor(Math.random() * 10);

    const step = () => {
      iterations++;
      current = (current + 1) % availableCount;
      setDisplayIndex(current);

      if (iterations >= totalIterations) {
        setDisplayIndex(winnerIdx);
        setSelectedIndex(winnerIdx);
        setIsSpinning(false);
        triggerConfetti();
      } else {
        if (iterations > totalIterations - 12) {
          speed += 30;
        } else if (iterations > totalIterations - 6) {
          speed += 60;
        } else {
          speed = Math.min(speed + 3, 120);
        }
        timerRef.current = setTimeout(step, speed);
      }
    };

    timerRef.current = setTimeout(step, speed);
  };

  useEffect(() => {
    if (isOpen && availableCount > 0) {
      startRoulette();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentCandidate =
    availableCount > 0
      ? pool[selectedIndex !== null && !isSpinning ? selectedIndex : displayIndex]
      : null;

  const handleNavigate = (restaurant: Restaurant) => {
    const url =
      restaurant.googleMapsUrl ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        restaurant.name + ' 葵興'
      )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden z-10 flex flex-col">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-orange-500/25 to-transparent blur-2xl pointer-events-none" />

        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <Dices className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base sm:text-lg font-black text-amber-400 tracking-tight">
                  今日食咩？幫我揀！
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  AI 命運之輪
                </span>
              </div>
              <p className="text-xs text-slate-400">
                從當前已篩選的 {availableCount} 間葵興餐廳中隨機抽出
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 text-center relative z-10">
          {availableCount === 0 ? (
            <div className="py-12 space-y-3">
              <div className="text-4xl">🤷‍♂️</div>
              <h4 className="text-lg font-bold text-slate-200">未有符合篩選條件的餐廳</h4>
              <p className="text-xs text-slate-400">
                請先嘗試放寬篩選條件或重設篩選，然後再試一次。
              </p>
            </div>
          ) : (
            <>
              <div
                className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-300 ${
                  isSpinning
                    ? 'border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.35)] scale-98'
                    : 'border-orange-500 shadow-[0_0_35px_rgba(249,115,22,0.4)] scale-100'
                }`}
              >
                <div className="relative h-60 sm:h-72 w-full bg-slate-800 overflow-hidden">
                  {currentCandidate && (
                    <>
                      <img
                        src={
                          currentCandidate.photo ||
                          currentCandidate.imageUrl ||
                          (currentCandidate.photos && currentCandidate.photos[0]) ||
                          'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={currentCandidate.name}
                        className={`w-full h-full object-cover transition-all duration-200 ${
                          isSpinning ? 'blur-xs scale-105 opacity-80' : 'blur-none scale-100 opacity-100'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                      {isSpinning && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/60 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-amber-400/40 shadow-xl flex items-center gap-2 animate-pulse">
                            <RotateCw className="w-5 h-5 text-amber-400 animate-spin" />
                            <span className="text-sm font-black tracking-widest text-amber-300 uppercase">
                              命運挑選中...
                            </span>
                          </div>
                        </div>
                      )}

                      {!isSpinning && (
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black bg-orange-600 text-white shadow-md">
                            <Award className="w-3.5 h-3.5" />
                            <span>今日之選！</span>
                          </span>

                          <div className="flex items-center gap-1">
                            {(currentCandidate.isFootbridgeConnected || currentCandidate.isSheltered) && (
                              <span className="flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-bold bg-sky-500 text-white shadow-md">
                                <CloudRain className="w-3 h-3" />
                                <span>天橋直達</span>
                              </span>
                            )}
                            <span className="flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-bold bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/30">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span>{currentCandidate.rating?.toFixed(1) || '4.5'}</span>
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 right-3 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white backdrop-blur-md">
                            {currentCandidate.zoneLabel || currentCandidate.zoneName || currentCandidate.zone}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                            <Footprints className="w-3 h-3 text-orange-400" />
                            <span>葵興站 {currentCandidate.walkingMinutes ?? currentCandidate.walkingMinutesFromMTR ?? 3} 分鐘</span>
                          </span>
                        </div>

                        <h4 className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
                          {currentCandidate.name}
                        </h4>

                        {(currentCandidate.highlightDish || currentCandidate.recommendationDish) && (
                          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/70 border border-amber-500/30 px-2.5 py-1 rounded-xl">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                            <span className="font-bold truncate">
                              必食：{currentCandidate.highlightDish || currentCandidate.recommendationDish}
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {!isSpinning && currentCandidate && (
                <div className="mt-4 py-2 px-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm font-semibold text-amber-300 flex items-center justify-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>今日命運決定咗就係佢！出發去食啦！</span>
                </div>
              )}

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  disabled={isSpinning || !currentCandidate}
                  onClick={() => currentCandidate && handleNavigate(currentCandidate)}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Navigation className="w-4 h-4" />
                  <span>就食呢間！(出發去 Google Maps)</span>
                </button>

                <button
                  type="button"
                  disabled={isSpinning}
                  onClick={startRoulette}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 border border-amber-500/30 rounded-2xl font-bold text-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                  <span>唔啱食，再抽一次 🔄</span>
                </button>
              </div>

              {!isSpinning && currentCandidate && onSelectRestaurant && (
                <div className="mt-3 text-center">
                  <button
                    onClick={() => {
                      onClose();
                      onSelectRestaurant(currentCandidate);
                    }}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    查看 {currentCandidate.name} 的詳細資料
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
