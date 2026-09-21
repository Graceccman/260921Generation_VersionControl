import React from 'react';
import { Search, X, ArrowUpDown, LayoutGrid, List, MapPin, Check, CloudRain, Clock } from 'lucide-react';
import { CUISINES } from '../config/kwaiHingConfig';
import type { SortOption, ViewMode } from '../types/restaurant';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCuisines: string[];
  onToggleCuisine: (cuisine: string) => void;
  onlyOpenNow: boolean;
  onToggleOpenNow: () => void;
  onlySheltered: boolean;
  onToggleSheltered: () => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  activeFilterCount: number;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCuisines,
  onToggleCuisine,
  onlyOpenNow,
  onToggleOpenNow,
  onlySheltered,
  onToggleSheltered,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  activeFilterCount,
  onResetFilters,
}) => {
  return (
    <div className="w-full bg-white/80 backdrop-blur-xs py-3 border-b border-slate-200/80 sticky top-16 md:top-20 z-20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
        {/* Top row: Search input, Sort, and View Modes */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜尋餐廳、菜式、或招牌菜（如：米線、車仔麵、咖啡、燒肉）..."
              className="w-full pl-10 pr-9 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 rounded-xl border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-hidden transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Toggles: Open Now & Sheltered */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onToggleOpenNow}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                onlyOpenNow
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>營業中</span>
              {onlyOpenNow && <Check className="w-3 h-3 ml-0.5" />}
            </button>

            <button
              onClick={onToggleSheltered}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                onlySheltered
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">天橋直達</span>
              <span className="sm:hidden">避雨</span>
              {onlySheltered && <Check className="w-3 h-3 ml-0.5" />}
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="appearance-none bg-white text-slate-700 text-xs font-semibold pl-8 pr-7 py-2 rounded-xl border border-slate-200 hover:border-slate-300 focus:outline-hidden focus:border-orange-500 cursor-pointer shadow-2xs"
              >
                <option value="distance">步行最近優先</option>
                <option value="rating">評分最高優先</option>
                <option value="reviews">最多評價熱門</option>
                <option value="price_asc">價格平至貴</option>
                <option value="price_desc">價格貴至平</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-orange-600 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="網格檢視 (Grid)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-orange-600 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="列表檢視 (List)"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('map')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-white text-orange-600 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="地圖檢視 (Map)"
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row: Cuisine chips & Reset */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            菜式:
          </span>
          {CUISINES.map((c: any) => {
            const id = typeof c === 'string' ? c : c.id;
            const label = typeof c === 'string' ? c : (c.label || c.nameZh || c.id);
            const icon = typeof c === 'string' ? '🍴' : (c.icon || '🍴');
            const isSelected = selectedCuisines.includes(id);

            return (
              <button
                key={id}
                onClick={() => onToggleCuisine(id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-orange-100 text-orange-800 border border-orange-300 font-semibold'
                    : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/80 border border-transparent'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            );
          })}

          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="ml-auto flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded-md hover:bg-rose-50 shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>重設 ({activeFilterCount})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
