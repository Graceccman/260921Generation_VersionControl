import React from 'react';
import { Dices, Sparkles, Flame } from 'lucide-react';

export interface DecisionPickerProps {
  onOpen: () => void;
  count: number;
}

export const DecisionPicker: React.FC<DecisionPickerProps> = ({ onOpen, count }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-orange-600 via-amber-600 to-red-600 p-4 sm:p-6 text-white shadow-xl shadow-orange-600/20 my-4 border border-orange-400/40">
      <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-6 -top-6 w-36 h-36 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md text-amber-200 text-xs font-bold mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>葵興打工仔選擇困難症救星</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center justify-center sm:justify-start gap-2">
            <span>今日食咩？一按幫你揀！</span>
            <Sparkles className="w-5 h-5 text-amber-300" />
          </h3>

          <p className="text-xs sm:text-sm text-orange-100 font-medium">
            已篩選 <span className="font-bold text-white underline">{count}</span> 間餐廳，搖骰抽一間，即抽即去食！
          </p>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="group relative shrink-0 flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-amber-50 active:scale-95 text-orange-600 hover:text-orange-700 rounded-2xl font-black text-base sm:text-lg shadow-2xl transition-all duration-200 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center transition-colors">
            <Dices className="w-5 h-5 text-orange-600 group-hover:rotate-180 transition-transform duration-500" />
          </div>
          <div className="text-left">
            <div className="leading-tight">🎲 幫我揀！</div>
            <div className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">
              SPIN & DECIDE
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
