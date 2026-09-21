import React from 'react';
import { Star, MapPin, Footprints, CloudRain, Heart, Navigation } from 'lucide-react';
import type { Restaurant, ViewMode } from '../types/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: (restaurant: Restaurant) => void;
  viewMode: ViewMode;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  isFavorite,
  onToggleFavorite,
  onClick,
  viewMode,
}) => {
  const getPriceString = (level?: number) => {
    switch (level) {
      case 1:
        return '$ (<$50)';
      case 2:
        return '$$ ($51-100)';
      case 3:
        return '$$$ ($101-200)';
      case 4:
        return '$$$$ (>$200)';
      default:
        return '$$ ($51-100)';
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(restaurant.id);
  };

  const handleNavigationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(restaurant.googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={() => onClick(restaurant)}
        className="group relative flex flex-col sm:flex-row items-stretch bg-white rounded-2xl border border-slate-200/90 hover:border-orange-400/80 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
      >
        {/* Thumbnail image */}
        <div className="relative w-full sm:w-56 h-44 sm:h-auto shrink-0 overflow-hidden bg-slate-100">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80';
            }}
          />
          {/* Walking badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-xs text-white shadow-xs">
            <Footprints className="w-3.5 h-3.5 text-amber-400" />
            <span>步行 {restaurant.walkingMinutes} 分鐘</span>
          </div>

          {/* Favorite button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-600 hover:text-rose-500 shadow-xs transition-transform hover:scale-110 active:scale-95 cursor-pointer"
            title={isFavorite ? '取消收藏' : '加入收藏'}
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`}
            />
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200">
                    {restaurant.zoneName}
                  </span>
                  {restaurant.isSheltered && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      <CloudRain className="w-3 h-3" />
                      天橋直達
                    </span>
                  )}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {restaurant.cuisineLabel}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors mt-1.5">
                  {restaurant.name}
                </h3>
                {restaurant.nameEn && (
                  <p className="text-xs text-slate-400 font-medium">{restaurant.nameEn}</p>
                )}
              </div>

              {/* Price & Rating */}
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 text-amber-500 justify-end">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-sm font-bold text-slate-900">{restaurant.rating.toFixed(1)}</span>
                  <span className="text-xs text-slate-400">({restaurant.reviewCount})</span>
                </div>
                <span className="text-xs font-semibold text-slate-500 mt-0.5 block">
                  {getPriceString(restaurant.priceLevel)}
                </span>
              </div>
            </div>

            {/* Address */}
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{restaurant.address}</span>
            </p>

            {/* Highlights chips */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {restaurant.highlights?.slice(0, 3).map((hl, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                >
                  #{hl}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom row actions */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  restaurant.isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                }`}
              />
              <span className={restaurant.isOpenNow ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                {restaurant.openingHoursText}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleNavigationClick}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-200 transition-colors cursor-pointer"
                title="以 Google Maps 規劃路線"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>點樣去</span>
              </button>
              <button className="px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-2xs transition-colors cursor-pointer">
                睇詳情
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div
      onClick={() => onClick(restaurant)}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 hover:border-orange-400/80 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer transform hover:-translate-y-1"
    >
      {/* Photo Header */}
      <div className="relative w-full aspect-16/10 overflow-hidden bg-slate-100">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-xs text-white shadow-xs">
            <Footprints className="w-3.5 h-3.5 text-amber-400" />
            <span>步行 {restaurant.walkingMinutes} 分鐘</span>
          </div>
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-600 hover:text-rose-500 shadow-xs transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          title={isFavorite ? '取消收藏' : '加入收藏'}
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`}
          />
        </button>

        {/* Sheltered Tag if applicable */}
        {restaurant.isSheltered && (
          <div className="absolute bottom-2.5 left-2.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white shadow-xs">
              <CloudRain className="w-3 h-3" />
              天橋直達
            </span>
          </div>
        )}

        {/* Rating pill */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold shadow-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{restaurant.rating.toFixed(1)}</span>
          <span className="text-[10px] text-slate-300">({restaurant.reviewCount})</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-orange-600 truncate">{restaurant.zoneName}</span>
            <span className="font-medium shrink-0">{getPriceString(restaurant.priceLevel)}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          {restaurant.nameEn && (
            <p className="text-xs text-slate-400 font-medium truncate mb-2">{restaurant.nameEn}</p>
          )}

          {/* Address */}
          <p className="text-xs text-slate-500 flex items-center gap-1 line-clamp-1 mb-2.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{restaurant.address}</span>
          </p>

          {/* Highlights tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {restaurant.highlights?.slice(0, 2).map((hl, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
              >
                #{hl}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                restaurant.isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
              }`}
            />
            <span className={restaurant.isOpenNow ? 'text-emerald-700 font-medium text-[11px]' : 'text-slate-400 text-[11px]'}>
              {restaurant.isOpenNow ? '營業中' : '休息中'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleNavigationClick}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-orange-600 border border-slate-200 transition-colors cursor-pointer"
              title="以 Google Maps 導航"
            >
              <Navigation className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform flex items-center">
              詳情 &rarr;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
