import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCw, X, Navigation, Eye, Footprints, Star, CloudRain, Dices, Gift } from 'lucide-react';
import type { Restaurant } from '../types/restaurant';

interface DecisionMakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableRestaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

type Mode = 'wheel' | 'cards';

export const DecisionMakerModal: React.FC<DecisionMakerModalProps> = ({
  isOpen,
  onClose,
  availableRestaurants,
  onSelectRestaurant,
}) => {
  const [mode, setMode] = useState<Mode>('wheel');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Restaurant | null>(null);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [cardRevealed, setCardRevealed] = useState<number | null>(null);
  const [onlySheltered, setOnlySheltered] = useState(false);
  const [onlyBudget, setOnlyBudget] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Filter pool
  const candidatePool = availableRestaurants.filter((r) => {
    if (onlySheltered && !r.isSheltered) return false;
    if (onlyBudget && (r.priceLevel ?? 2) > 1) return false;
    return true;
  });

  // Sound effect generator with Web Audio API
  const playBeep = (frequency = 440, duration = 0.05) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current && AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (!audioCtxRef.current) return;

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + duration);
    } catch {
      // Audio not supported or blocked, ignore
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#e11d48', '#3b82f6', '#10b981', '#f59e0b'],
      });
    } catch {
      // fallback
    }
  };

  // Handle spin for carousel wheel
  const handleSpin = () => {
    if (candidatePool.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    let speed = 40; // ms per frame
    let iterations = 0;
    const maxIterations = 28 + Math.floor(Math.random() * 10);
    const pool = candidatePool;

    const interval = () => {
      setDisplayIndex((prev) => (prev + 1) % pool.length);
      playBeep(450 + (iterations % 4) * 40, 0.04);
      iterations++;

      if (iterations < maxIterations) {
        // gradually slow down
        if (iterations > maxIterations - 10) {
          speed += 28;
        } else if (iterations > maxIterations - 20) {
          speed += 12;
        }
        setTimeout(interval, speed);
      } else {
        // Finish!
        const winningPick = pool[Math.floor(Math.random() * pool.length)];
        setWinner(winningPick);
        setIsSpinning(false);
        playBeep(880, 0.25);
        triggerConfetti();
      }
    };

    setTimeout(interval, speed);
  };

  // Handle card reveal
  const handleCardClick = (cardIdx: number) => {
    if (candidatePool.length === 0 || isSpinning || cardRevealed !== null) return;
    setIsSpinning(true);
    setCardRevealed(cardIdx);

    playBeep(520, 0.1);

    setTimeout(() => {
      const winningPick = candidatePool[Math.floor(Math.random() * candidatePool.length)];
      setWinner(winningPick);
      setIsSpinning(false);
      playBeep(880, 0.25);
      triggerConfetti();
    }, 450);
  };

  // Reset winner on reopen
  useEffect(() => {
    if (isOpen) {
      setWinner(null);
      setCardRevealed(null);
      setIsSpinning(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentDisplay = candidatePool[displayIndex % (candidatePool.length || 1)] || candidatePool[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-linear-to-r from-orange-500 via-amber-500 to-rose-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-amber-200 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">今日食咩？「幫我揀！」</h3>
              <p className="text-xs text-white/85 font-medium">
                專治選擇困難症，一鍵決定葵興午餐
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode selector & Filters bar */}
        <div className="px-5 pt-4 pb-2 border-b border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            {/* Mode switch */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => {
                  setMode('wheel');
                  setWinner(null);
                  setCardRevealed(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === 'wheel'
                    ? 'bg-white text-orange-600 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Dices className="w-3.5 h-3.5" />
                <span>食神輪盤</span>
              </button>
              <button
                onClick={() => {
                  setMode('cards');
                  setWinner(null);
                  setCardRevealed(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === 'cards'
                    ? 'bg-white text-orange-600 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Gift className="w-3.5 h-3.5" />
                <span>盲盒翻牌</span>
              </button>
            </div>

            {/* Candidate count */}
            <span className="text-xs font-semibold text-slate-500">
              候選餐廳：<span className="text-orange-600 font-bold">{candidatePool.length}</span> 間
            </span>
          </div>

          {/* Quick constraints in picker */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setOnlySheltered(!onlySheltered)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                onlySheltered
                  ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CloudRain className="w-3 h-3" />
              <span>只要天橋直達</span>
            </button>
            <button
              onClick={() => setOnlyBudget(!onlyBudget)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                onlyBudget
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>💰 只要平靚正 (&lt;$60)</span>
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="p-5 flex-1 flex flex-col justify-center items-center">
          {candidatePool.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm font-semibold text-slate-600 mb-2">
                當前篩選條件下沒有候選餐廳
              </p>
              <button
                onClick={() => {
                  setOnlySheltered(false);
                  setOnlyBudget(false);
                }}
                className="text-xs font-bold text-orange-600 underline cursor-pointer"
              >
                重設挑選條件
              </button>
            </div>
          ) : winner ? (
            /* Winner Card */
            <div className="w-full bg-linear-to-b from-orange-50/70 to-amber-50/50 rounded-2xl p-4 sm:p-5 border-2 border-orange-400/80 shadow-md animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-orange-500 text-white shadow-2xs">
                  🎉 今日就食呢間！
                </span>
                <span className="text-xs font-bold text-slate-500">{winner.zoneName}</span>
              </div>

              {/* Photo & Name */}
              <div className="flex gap-3.5 items-center my-3">
                <img
                  src={winner.imageUrl}
                  alt={winner.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg sm:text-xl font-black text-slate-900 truncate">
                    {winner.name}
                  </h4>
                  {winner.nameEn && (
                    <p className="text-xs text-slate-400 truncate">{winner.nameEn}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-0.5 text-xs font-bold text-slate-800">
                      <Footprints className="w-3.5 h-3.5 text-orange-600" />
                      步行 {winner.walkingMinutes} 分鐘
                    </span>
                    <span className="flex items-center gap-0.5 text-xs font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {winner.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <p className="text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-orange-100 line-clamp-2 mb-4">
                💡 推薦理由：{winner.description}
              </p>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onSelectRestaurant(winner);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-orange-600" />
                  <span>睇詳細菜單</span>
                </button>

                <a
                  href={winner.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-2xs transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>即刻出發導航</span>
                </a>
              </div>
            </div>
          ) : mode === 'wheel' ? (
            /* Carousel Slot Machine */
            <div className="w-full flex flex-col items-center py-4">
              <div className="w-full bg-slate-900 text-white p-5 rounded-3xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden border-4 border-amber-400/40">
                <div className="text-[11px] font-bold text-amber-300 uppercase tracking-widest mb-1.5">
                  {isSpinning ? '🌀 食神正在選定中...' : '準備開獎！'}
                </div>

                <div className="text-2xl sm:text-3xl font-black text-center text-amber-400 tracking-tight h-10 flex items-center justify-center">
                  {currentDisplay ? currentDisplay.name : '葵興美食'}
                </div>

                <div className="text-xs text-slate-300 mt-1">
                  {currentDisplay ? `${currentDisplay.zoneName} · 步行 ${currentDisplay.walkingMinutes} 分鐘` : ''}
                </div>

                {isSpinning && (
                  <div className="absolute inset-0 bg-orange-500/10 backdrop-blur-[1px] flex items-center justify-center pointer-events-none" />
                )}
              </div>

              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="mt-6 w-full max-w-xs flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm sm:text-base font-black bg-linear-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-lg shadow-orange-500/30 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>{isSpinning ? '轉動中...' : '就食呢間啦！(開始抽獎)'}</span>
              </button>
            </div>
          ) : (
            /* 3 Mystery Cards */
            <div className="w-full py-4">
              <p className="text-xs text-center text-slate-500 font-semibold mb-4">
                憑直覺點擊一張食神吉卡翻開命定美食：
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '大吉', sub: '好滋味' },
                  { label: '食神', sub: '性價比' },
                  { label: '如意', sub: '豐盛餐' },
                ].map((card, idx) => {
                  const isThisRevealed = cardRevealed === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleCardClick(idx)}
                      className={`h-36 rounded-2xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all transform duration-300 ${
                        isThisRevealed
                          ? 'bg-orange-500 text-white scale-105 shadow-xl ring-4 ring-amber-300'
                          : 'bg-linear-to-br from-amber-500 to-orange-600 text-white hover:-translate-y-1 hover:shadow-lg active:scale-95'
                      }`}
                    >
                      <span className="text-3xl mb-1">🎴</span>
                      <span className="text-base font-black">{card.label}</span>
                      <span className="text-[10px] text-white/80">{card.sub}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {winner && (
            <button
              onClick={() => {
                setWinner(null);
                setCardRevealed(null);
              }}
              className="mt-4 text-xs font-bold text-slate-500 hover:text-orange-600 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>唔啱心水？再抽過！</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
