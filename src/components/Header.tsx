import React from 'react';
import { Utensils, CloudRain, Key, Heart, Sparkles } from 'lucide-react';

interface HeaderProps {
  apiKey: string;
  isLiveApi: boolean;
  totalRestaurants: number;
  filteredCount: number;
  favoriteCount: number;
  isRainyActive: boolean;
  onToggleRainy: () => void;
  onOpenApiKeyModal: () => void;
  onOpenDecisionMaker: () => void;
  onOpenFavorites: () => void;
  onResetFilters: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  apiKey,
  isLiveApi,
  favoriteCount,
  isRainyActive,
  onToggleRainy,
  onOpenApiKeyModal,
  onOpenDecisionMaker,
  onOpenFavorites,
  onResetFilters,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-2">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onResetFilters}>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-linear-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 ring-2 ring-white transform transition hover:scale-105">
              <Utensils className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 bg-linear-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                  葵興食乜好
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">
                  Kwai Hing Eats
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden xs:block">
                今日食咩？葵興打工仔與街坊專屬決定工具
              </p>
            </div>
          </div>

          {/* Quick Actions & Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Rainy Mode Fast Toggle */}
            <button
              onClick={onToggleRainy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                isRainyActive
                  ? 'bg-blue-600 text-white shadow-blue-500/25 ring-2 ring-blue-300'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
              }`}
              title="一鍵篩選：商場天橋全程有蓋直達食肆"
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">落雨唔想淋</span>
              <span className="sm:hidden">避雨</span>
            </button>

            {/* "幫我揀！" Decision Button in Header */}
            <button
              onClick={onOpenDecisionMaker}
              className="flex items-center gap-1.5 px-3.5 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold bg-linear-to-r from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>幫我揀！</span>
            </button>

            {/* Favorites Drawer Toggle */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
              title="查看已收藏餐廳"
            >
              <Heart className="w-4 h-4 md:w-5 md:h-5" />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale">
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* Google Places API Key Status & Config Button */}
            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                isLiveApi
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : apiKey
                  ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="設定 Google Places API Key"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {isLiveApi ? 'Google API 已連線' : apiKey ? 'API 已設定' : '離線精選模式'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isLiveApi ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
