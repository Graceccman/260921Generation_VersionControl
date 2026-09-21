import React from 'react';
import { SUB_ZONES } from '../config/kwaiHingConfig';
import type { SubZoneId, Restaurant } from '../types/restaurant';
import { Building2, Train, Factory, UtensilsCrossed, Compass } from 'lucide-react';

interface ZoneTabsProps {
  selectedZone: SubZoneId;
  onSelectZone: (zone: SubZoneId) => void;
  restaurants: Restaurant[];
}

export const ZoneTabs: React.FC<ZoneTabsProps> = ({
  selectedZone,
  onSelectZone,
  restaurants,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-4 h-4" />;
      case 'Train':
        return <Train className="w-4 h-4" />;
      case 'Factory':
        return <Factory className="w-4 h-4" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-4 h-4" />;
      default:
        return <Compass className="w-4 h-4" />;
    }
  };

  const getZoneCount = (zoneId: SubZoneId) => {
    if (zoneId === 'all') return restaurants.length;
    return restaurants.filter((r) => r.zone === zoneId).length;
  };

  return (
    <div className="w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none no-scrollbar">
          {SUB_ZONES.map((zone) => {
            const isSelected = selectedZone === zone.id;
            const count = getZoneCount(zone.id);

            return (
              <button
                key={zone.id}
                onClick={() => onSelectZone(zone.id)}
                className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className={isSelected ? 'text-white' : 'text-slate-400 group-hover:text-orange-500'}>
                  {getIcon(zone.icon || '')}
                </span>
                <span>{zone.name}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-200/80 text-slate-600'
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
