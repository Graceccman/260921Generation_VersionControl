export type PriceLevel = 1 | 2 | 3 | 4;

export type SortOption =
  | 'recommended'
  | 'nearest'
  | 'walkingTime'
  | 'rating'
  | 'reviews'
  | 'distance'
  | 'price_asc'
  | 'price_desc'
  | string;

export type ZoneId =
  | 'all'
  | 'kcc'
  | 'sun-kwai-hing'
  | 'sun_kwai_hing'
  | 'tai-lin-pai'
  | 'kc100'
  | 'kc100_industrial'
  | 'kwong-fai'
  | 'kwong_fai_circuit'
  | 'kwong_fai_wai'
  | string;

export type SubZoneId = ZoneId;

export type ScenarioId = string;

export type ViewMode = 'grid' | 'list' | 'map';

/**
 * Cuisine Category Type
 */
export interface CuisineType {
  id: string;
  nameZh?: string;
  label?: string;
  icon?: string;
  [key: string]: any;
}

/**
 * Geographic Zone representing Kwai Hing districts
 */
export interface Zone {
  id: string;
  name?: string;
  nameZh?: string;
  nameEn?: string;
  description?: string;
  icon?: string;
  center?: {
    lat: number;
    lng: number;
  };
  label?: string;
  shortLabel?: string;
  color?: string;
  accentBg?: string;
  walkingMinutes?: string;
  walkingFromMTR?: string;
  isSheltered?: boolean;
  [key: string]: any;
}

export type ZoneMeta = Zone;
export type SubZone = Zone;

/**
 * Dining Scenario Type (Lunch vibes)
 */
export interface ScenarioType {
  id: ScenarioId;
  nameZh?: string;
  nameEn?: string;
  icon?: string;
  emoji?: string;
  description?: string;
  color?: string;
  label?: string;
  labelEn?: string;
  subtitle?: string;
  shortDescription?: string;
  badgeBg?: string;
  badgeText?: string;
  badgeColor?: string;
  [key: string]: any;
}

export type ScenarioMeta = ScenarioType;
export type Scenario = ScenarioType;

/**
 * Core Restaurant Interface representing dining establishments in Kwai Hing
 */
export interface Restaurant {
  id: string;
  name: string;
  nameEn?: string;
  zoneId?: string;
  zone?: string;
  zoneName?: string;
  zoneLabel?: string;
  address: string;
  addressEn?: string;
  lat?: number;
  lng?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  rating: number;
  userRatingsTotal?: number;
  reviewCount?: number;
  priceLevel: PriceLevel;
  priceRange?: string;
  photo?: string;
  photos?: string[];
  imageUrl?: string;
  openNow?: boolean;
  isOpenNow?: boolean;
  openingHours?: {
    text: string;
    isOpenNow: boolean;
  } | string[] | any;
  openingHoursText?: string;
  walkingMinutes?: number;
  walkingMinutesFromMTR?: number;
  distanceMeters?: number;
  walkingDirections?: string;
  walkDirections?: string;
  mtrExit?: 'Exit A' | 'Exit B' | 'Exit E' | string;
  isFootbridgeConnected?: boolean;
  isSheltered?: boolean;
  cuisine?: string | CuisineType | any;
  cuisineLabel?: string;
  cuisineTags?: string[];
  cuisineType?: string;
  scenarios?: ScenarioId[] | string[];
  tags?: string[];
  highlights?: string[];
  phone?: string;
  googlePlaceId?: string;
  googleMapsUrl?: string;
  description?: string;
  highlightDish?: string;
  recommendationDish?: string;
  popularDishes?: string[];
  source?: 'curated' | 'seed' | 'google_places' | string;
  [key: string]: any;
}

/**
 * Search and Filter State
 */
export interface FilterState {
  selectedZone: string | null;
  selectedScenario: string | null;
  selectedCuisines: (CuisineType | string)[];
  openNowOnly: boolean;
  shelteredOnly: boolean;
  maxPrice: number | null;
  searchQuery: string;
  sortBy: SortOption;
}
