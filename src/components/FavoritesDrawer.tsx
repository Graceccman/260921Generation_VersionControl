import React from 'react';
import { X, Heart, Trash2, Footprints, Star, Sparkles } from 'lucide-react';
import type { Restaurant } from '../types/restaurant';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Restaurant[];
  onRemoveFavorite: (id: string) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onPickFromFavorites: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectRestaurant,
  onPickFromFavorites,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">我的心水食肆</h3>
              <p className="text-xs text-slate-500">已儲存 {favorites.length} 間常去或想試的餐廳</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favorites.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Heart className="w-12 h-12 stroke-[1.5] mb-3 text-slate-300" />
              <p className="text-sm font-bold text-slate-700">仲未有心水收藏</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                在食肆卡片點擊右上角的小紅心 ❤️，就可以隨時將餐廳儲存到呢度！
              </p>
            </div>
          ) : (
            favorites.map((r) => (
              <div
                key={r.id}
                onClick={() => {
                  onSelectRestaurant(r);
                  onClose();
                }}
                className="group flex gap-3 p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-400/80 shadow-2xs hover:shadow-md transition-all cursor-pointer items-center"
              >
                <img
                  src={r.imageUrl}
                  alt={r.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-orange-50 text-orange-700">
                      {r.zoneName}
                    </span>
                    {r.isSheltered && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-700">
                        天橋直達
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors truncate mt-1">
                    {r.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-0.5">
                      <Footprints className="w-3 h-3 text-orange-500" />
                      步行 {r.walkingMinutes} 分鐘
                    </span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {r.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(r.id);
                  }}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="從收藏中移除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {favorites.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
            <button
              onClick={() => {
                onClose();
                onPickFromFavorites();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-linear-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-md shadow-orange-500/25 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>喺收藏入面幫我揀！（隨機輪盤）</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
