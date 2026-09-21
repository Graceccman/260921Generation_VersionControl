import { useState, useEffect, useMemo } from 'react';
import { SEED_RESTAURANTS } from './config/kwaiHingConfig';
import type { Restaurant, SubZoneId, ScenarioId, SortOption, ViewMode } from './types/restaurant';
import { storageService } from './services/storage';
import { googlePlacesService } from './services/googlePlaces';
import { Header } from './components/Header';
import { ScenarioBar } from './components/ScenarioBar';
import { ZoneTabs } from './components/ZoneTabs';
import { FilterBar } from './components/FilterBar';
import { RestaurantGrid } from './components/RestaurantGrid';
import { RestaurantModal } from './components/RestaurantModal';
import { DecisionMakerModal } from './components/DecisionMakerModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { MapView } from './components/MapView';
import { Sparkles } from 'lucide-react';

export function App() {
  // Primary state
  const [restaurants, setRestaurants] = useState<Restaurant[]>(SEED_RESTAURANTS);
  const [apiKey, setApiKey] = useState<string>(() => storageService.getApiKey());
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => storageService.getFavorites());

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<SubZoneId>('all');
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId | null>(null);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);
  const [onlySheltered, setOnlySheltered] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Modal controls
  const [isDecisionMakerOpen, setIsDecisionMakerOpen] = useState(false);
  const [decisionPoolOverride, setDecisionPoolOverride] = useState<Restaurant[] | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isFavoritesDrawerOpen, setIsFavoritesDrawerOpen] = useState(false);

  // Initialize live API if key is present
  useEffect(() => {
    if (apiKey) {
      googlePlacesService
        .fetchKwaiHingPlaces(apiKey)
        .then((places: Restaurant[]) => {
          setRestaurants(places);
          setIsLiveApi(true);
        })
        .catch((err: unknown) => {
          console.warn('Initial Google Places fetch failed, using curated seed places:', err);
          setIsLiveApi(false);
        });
    }
  }, [apiKey]);

  // Handle Save API Key
  const handleSaveApiKey = async (newKey: string): Promise<boolean> => {
    try {
      const places = await googlePlacesService.fetchKwaiHingPlaces(newKey);
      storageService.setApiKey(newKey);
      setApiKey(newKey);
      setRestaurants(places);
      setIsLiveApi(true);
      return true;
    } catch (e) {
      console.error('Failed to validate new API key', e);
      return false;
    }
  };

  const handleClearApiKey = () => {
    storageService.setApiKey('');
    setApiKey('');
    setRestaurants(SEED_RESTAURANTS);
    setIsLiveApi(false);
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    const updated = storageService.toggleFavorite(id);
    setFavoriteIds(updated);
  };

  // Quick Rainy mode toggle
  const handleToggleRainy = () => {
    if (onlySheltered || selectedScenario === 'rainy_day') {
      setOnlySheltered(false);
      setSelectedScenario(null);
    } else {
      setOnlySheltered(true);
      setSelectedScenario('rainy_day');
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedZone('all');
    setSelectedScenario(null);
    setSelectedCuisines([]);
    setOnlyOpenNow(false);
    setOnlySheltered(false);
    setSortBy('distance');
  };

  // Filter & Sort Logic
  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter((r) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = r.name.toLowerCase().includes(q) || (r.nameEn?.toLowerCase().includes(q) ?? false);
          const matchAddress = r.address.toLowerCase().includes(q);
          const matchHighlights = r.highlights?.some((h) => h.toLowerCase().includes(q)) ?? false;
          const matchCuisine = r.cuisineLabel?.toLowerCase().includes(q) ?? false;
          const matchDesc = r.description?.toLowerCase().includes(q) ?? false;
          if (!matchName && !matchAddress && !matchHighlights && !matchCuisine && !matchDesc) {
            return false;
          }
        }

        // Zone filter
        if (selectedZone !== 'all' && r.zone !== selectedZone) {
          return false;
        }

        // Scenario filter
        if (selectedScenario && !r.scenarios?.includes(selectedScenario)) {
          return false;
        }

        // Cuisine filter
        if (selectedCuisines.length > 0 && (!r.cuisine || !selectedCuisines.includes(r.cuisine as any))) {
          return false;
        }

        // Open now filter
        if (onlyOpenNow && !r.isOpenNow) {
          return false;
        }

        // Sheltered filter
        if (onlySheltered && !r.isSheltered) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'distance':
            return (a.walkingMinutes || 0) - (b.walkingMinutes || 0);
          case 'rating':
            return (b.rating || 0) - (a.rating || 0) || (b.reviewCount || 0) - (a.reviewCount || 0);
          case 'reviews':
            return (b.reviewCount || 0) - (a.reviewCount || 0);
          case 'price_asc':
            return (a.priceLevel || 1) - (b.priceLevel || 1);
          case 'price_desc':
            return (b.priceLevel || 1) - (a.priceLevel || 1);
          default:
            return (a.walkingMinutes || 0) - (b.walkingMinutes || 0);
        }
      });
  }, [
    restaurants,
    searchQuery,
    selectedZone,
    selectedScenario,
    selectedCuisines,
    onlyOpenNow,
    onlySheltered,
    sortBy,
  ]);

  // Compute active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedZone !== 'all') count++;
    if (selectedScenario !== null) count++;
    if (selectedCuisines.length > 0) count += selectedCuisines.length;
    if (onlyOpenNow) count++;
    if (onlySheltered) count++;
    return count;
  }, [searchQuery, selectedZone, selectedScenario, selectedCuisines, onlyOpenNow, onlySheltered]);

  // Favorite list items
  const favoriteRestaurants = useMemo(() => {
    return restaurants.filter((r) => favoriteIds.includes(r.id));
  }, [restaurants, favoriteIds]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        apiKey={apiKey}
        isLiveApi={isLiveApi}
        totalRestaurants={restaurants.length}
        filteredCount={filteredRestaurants.length}
        favoriteCount={favoriteIds.length}
        isRainyActive={onlySheltered || selectedScenario === 'rainy_day'}
        onToggleRainy={handleToggleRainy}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenDecisionMaker={() => {
          setDecisionPoolOverride(null);
          setIsDecisionMakerOpen(true);
        }}
        onOpenFavorites={() => setIsFavoritesDrawerOpen(true)}
        onResetFilters={handleResetFilters}
      />

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-linear-to-r from-amber-500 via-orange-500 to-rose-600 text-white py-6 md:py-8 shadow-sm">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
              <span>🇭🇰 葵興葵涌打工仔覓食指南</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-xs">
              今日食咩？一秒解救選擇困難！
            </h2>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl">
              精選 KCC、新葵興廣場、KC100 工廈區與光輝圍地道美食。落雨有蓋天橋路線、步行時間精準指引。
            </p>
          </div>

          {/* Quick Hero Decision CTA */}
          <div className="shrink-0 flex items-center gap-2.5">
            <button
              onClick={() => {
                setDecisionPoolOverride(null);
                setIsDecisionMakerOpen(true);
              }}
              className="group flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-orange-600 hover:text-orange-700 font-black text-sm sm:text-base shadow-xl shadow-black/10 hover:shadow-2xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-500 group-hover:rotate-12 transition-transform" />
              <span>幫我揀！（隨機輪盤）</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scenario Bar (Mood Quick Picks) */}
      <ScenarioBar
        selectedScenario={selectedScenario}
        onSelectScenario={(sc) => {
          setSelectedScenario(sc);
          if (sc === 'rainy_day') {
            setOnlySheltered(true);
          }
        }}
        restaurants={restaurants}
      />

      {/* Kwai Hing Sub-zone Tabs */}
      <ZoneTabs
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
        restaurants={restaurants}
      />

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCuisines={selectedCuisines}
        onToggleCuisine={(c: string) => {
          setSelectedCuisines((prev) =>
            prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
          );
        }}
        onlyOpenNow={onlyOpenNow}
        onToggleOpenNow={() => setOnlyOpenNow(!onlyOpenNow)}
        onlySheltered={onlySheltered}
        onToggleSheltered={() => setOnlySheltered(!onlySheltered)}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeFilterCount={activeFilterCount}
        onResetFilters={handleResetFilters}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {viewMode === 'map' ? (
          <MapView
            restaurants={filteredRestaurants}
            isGoogleLive={isLiveApi}
            onSelectRestaurant={setSelectedRestaurant}
          />
        ) : (
          <RestaurantGrid
            restaurants={filteredRestaurants}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            onSelectRestaurant={setSelectedRestaurant}
            viewMode={viewMode}
            onResetFilters={handleResetFilters}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm">葵興食乜好 / Kwai Hing Eats</span>
              <span className="text-slate-300">|</span>
              <span>專為葵興打工仔及街坊而設的美食決策神器</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsApiKeyModalOpen(true)}
                className="hover:text-orange-600 font-medium cursor-pointer"
              >
                API 設定 ({isLiveApi ? 'Google Live' : '離線模式'})
              </button>
              <button
                onClick={handleResetFilters}
                className="hover:text-orange-600 font-medium cursor-pointer"
              >
                全部食肆
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400 text-[11px]">
            <p>
              📍 地理座標基準：葵興港鐵站 (22.3636° N, 114.1313° E) · 步行距離依實際街道天橋測算
            </p>
            <p>© 2026 Kwai Hing Eats · No DB Architecture</p>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <RestaurantModal
        restaurant={selectedRestaurant}
        isOpen={!!selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
        isFavorite={selectedRestaurant ? favoriteIds.includes(selectedRestaurant.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      <DecisionMakerModal
        isOpen={isDecisionMakerOpen}
        onClose={() => setIsDecisionMakerOpen(false)}
        availableRestaurants={decisionPoolOverride || filteredRestaurants}
        onSelectRestaurant={setSelectedRestaurant}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentKey={apiKey}
        isLiveApi={isLiveApi}
        onSaveKey={handleSaveApiKey}
        onClearKey={handleClearApiKey}
      />

      <FavoritesDrawer
        isOpen={isFavoritesDrawerOpen}
        onClose={() => setIsFavoritesDrawerOpen(false)}
        favorites={favoriteRestaurants}
        onRemoveFavorite={handleToggleFavorite}
        onSelectRestaurant={setSelectedRestaurant}
        onPickFromFavorites={() => {
          setDecisionPoolOverride(favoriteRestaurants);
          setIsDecisionMakerOpen(true);
        }}
      />
    </div>
  );
}

export default App;
