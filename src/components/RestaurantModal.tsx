import React, { useState, useEffect } from 'react';
import { X, MapPin, Footprints, CloudRain, Star, Phone, Clock, Navigation, Heart, Share2, Copy, Check, ExternalLink } from 'lucide-react';
import type { Restaurant } from '../types/restaurant';

interface RestaurantModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const RestaurantModal: React.FC<RestaurantModalProps> = ({
  restaurant,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !restaurant) return null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${restaurant.name} - ${restaurant.address}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = `🍽️ 今日不如食呢間？【${restaurant.name}】\n📍 地點：葵興 ${restaurant.zoneName}（步行 ${restaurant.walkingMinutes} 分鐘）\n⭐ 評分：${restaurant.rating} 星\n👉 導航：${restaurant.googleMapsUrl}`;
    if (navigator.share) {
      navigator
        .share({
          title: `葵興食乜好 - ${restaurant.name}`,
          text: text,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const getPriceDescription = (level?: number) => {
    switch (level) {
      case 1:
        return '$ (平民價，人均 $50 以下)';
      case 2:
        return '$$ (標準價，人均 $51 - $100)';
      case 3:
        return '$$$ (中高檔，人均 $101 - $200)';
      case 4:
        return '$$$$ (高級/宴會，人均 $200 以上)';
      default:
        return '$$';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Image Section */}
        <div className="relative w-full h-56 sm:h-64 bg-slate-100 shrink-0">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-md text-white">
              <Footprints className="w-3.5 h-3.5 text-amber-400" />
              <span>港鐵步行 {restaurant.walkingMinutes} 分鐘</span>
            </span>

            {restaurant.isSheltered && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-600/90 backdrop-blur-md text-white">
                <CloudRain className="w-3.5 h-3.5" />
                <span>天橋直達 (落雨唔怕)</span>
              </span>
            )}
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-orange-500 text-white">
                {restaurant.zoneName}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-white/20 backdrop-blur-md text-white">
                {restaurant.cuisineLabel}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{restaurant.name}</h2>
            {restaurant.nameEn && (
              <p className="text-xs sm:text-sm text-slate-200 font-medium">{restaurant.nameEn}</p>
            )}
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400">Google 評分</span>
              <div className="flex items-center gap-1 text-slate-900 font-black text-base mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{(restaurant.rating ?? 4.0).toFixed(1)}</span>
                <span className="text-xs font-normal text-slate-400">({restaurant.reviewCount || 0})</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400">消費預算</span>
              <span className="text-sm font-bold text-slate-800 mt-0.5">
                {getPriceDescription(restaurant.priceLevel ?? 1).split(' ')[0]}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400">當前狀態</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    restaurant.isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                  }`}
                />
                <span
                  className={`text-xs font-bold ${
                    restaurant.isOpenNow ? 'text-emerald-700' : 'text-slate-500'
                  }`}
                >
                  {restaurant.isOpenNow ? '營業中' : '休息中'}
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400">避雨條件</span>
              <span className="text-xs font-semibold text-slate-800 mt-0.5">
                {restaurant.isSheltered ? '全程有蓋天橋' : '需行戶外露天'}
              </span>
            </div>
          </div>

          {/* Description & Vibe */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              簡介與食客推薦
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-orange-50/50 p-3.5 rounded-xl border border-orange-100/70">
              {restaurant.description}
            </p>
          </div>

          {/* Signature Highlights */}
          {restaurant.highlights && restaurant.highlights.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                招牌必試 / 食物亮點
              </h4>
              <div className="flex flex-wrap gap-2">
                {restaurant.highlights.map((hl, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200"
                  >
                    ✨ {hl}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Walking route and directions */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              前往方式與地址
            </h4>

            {/* Walking direction guide */}
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
              <Footprints className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">葵興站步行指南：</span>
                <p className="mt-0.5 text-slate-600">{restaurant.walkDirections}</p>
              </div>
            </div>

            {/* Address with copy */}
            <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl text-xs">
              <div className="flex items-start gap-2 text-slate-700 line-clamp-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{restaurant.address}</span>
              </div>
              <button
                onClick={handleCopyAddress}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '已複製' : '複製'}</span>
              </button>
            </div>

            {/* Hours and phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-slate-700">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>營業時間：{restaurant.openingHoursText}</span>
              </div>

              {restaurant.phone && (
                <a
                  href={`tel:${restaurant.phone}`}
                  className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-700 font-semibold transition-colors"
                >
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>致電預約：{restaurant.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {/* Favorite toggle */}
            <button
              onClick={() => onToggleFavorite(restaurant.id)}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                isFavorite
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden sm:inline">{isFavorite ? '已收藏' : '加入收藏'}</span>
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="分享給同事"
            >
              {shared ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{shared ? '已複製' : '分享推薦'}</span>
            </button>
          </div>

          {/* Direct Google Maps Direction button */}
          <a
            href={restaurant.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 max-w-xs flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/25 transition-all cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>Google Maps 導航前往</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>
    </div>
  );
};
