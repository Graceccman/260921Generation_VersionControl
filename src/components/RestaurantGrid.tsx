import React from 'react';
import type { Restaurant, ViewMode } from '../types/restaurant';
import { RestaurantCard } from './RestaurantCard';
import { UtensilsCrossed, RotateCcw } from 'lucide-react';

interface RestaurantGridProps {
  restaurants: Restaurant[];
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  viewMode: ViewMode;
  onResetFilters: () => void;
}

export const RestaurantGrid: React.FC<RestaurantGridProps> = ({
  restaurants,
  favoriteIds,
  onToggleFavorite,
  onSelectRestaurant,
  viewMode,
  onResetFilters,
}) => {
  if (restaurants.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-orange-100 flex items-center justify-center text-orange-600 mb-4 shadow-inner">
          <UtensilsCrossed className="w-10 h-10 animate-bounce" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          哎呀！搵唔到符合條件嘅葵興食肆
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          試下放寬篩選條件、取消特定情境標籤，或者換個關鍵字搜尋（例如「米線」、「Cafe」、「茶記」）。
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>重設所有篩選條件</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Count subheader */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs sm:text-sm font-semibold text-slate-500">
          共找到 <span className="text-orange-600 font-bold">{restaurants.length}</span> 間葵興精選食肆
        </p>
      </div>

      {/* Grid or List Layout */}
      <div
        className={
          viewMode === 'list'
            ? 'flex flex-col gap-3.5'
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5'
        }
      >
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            isFavorite={favoriteIds.includes(restaurant.id)}
            onToggleFavorite={onToggleFavorite}
            onClick={onSelectRestaurant}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
};
