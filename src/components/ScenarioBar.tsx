import React from 'react';
import { SCENARIOS } from '../config/kwaiHingConfig';
import type { ScenarioId, Restaurant } from '../types/restaurant';

interface ScenarioBarProps {
  selectedScenario: ScenarioId | null;
  onSelectScenario: (id: ScenarioId | null) => void;
  restaurants: Restaurant[];
}

export const ScenarioBar: React.FC<ScenarioBarProps> = ({
  selectedScenario,
  onSelectScenario,
  restaurants,
}) => {
  const getCount = (id: ScenarioId) => {
    return restaurants.filter((r) => r.scenarios?.includes(id)).length;
  };

  return (
    <div className="w-full bg-linear-to-b from-white to-slate-50/50 py-3 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              情境快選 (今日心情)
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              點擊即按場景過濾食肆
            </span>
          </div>
          {selectedScenario && (
            <button
              onClick={() => onSelectScenario(null)}
              className="text-xs text-orange-600 hover:text-orange-700 font-semibold cursor-pointer underline"
            >
              清除情境
            </button>
          )}
        </div>

        {/* Scrollable pill container */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
          {SCENARIOS.map((sc) => {
            const count = getCount(sc.id);
            const isSelected = selectedScenario === sc.id;

            return (
              <button
                key={sc.id}
                onClick={() => onSelectScenario(isSelected ? null : sc.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer select-none ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 ring-2 ring-orange-500 scale-[1.02]'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/90 shadow-2xs'
                }`}
              >
                <span className="text-base">{sc.emoji}</span>
                <span>{sc.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
