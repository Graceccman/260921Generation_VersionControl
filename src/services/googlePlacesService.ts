/// <reference types="google.maps" />

import {
  KWAI_HING_COORDINATES,
  SEARCH_RADIUS_METERS,
  WALKING_SPEED_METERS_PER_MIN,
  ZONES,
  kwaiHingSeedPlaces,
} from '../config/kwaiHingConfig';
import type { PriceLevel, Restaurant, ZoneId } from '../types/restaurant';

export const PRIMARY_API_KEY_STORAGE = 'kwai_hing_gmaps_key';
export const LEGACY_API_KEY_STORAGE = 'kwai_hing_eats_google_maps_api_key';

let scriptLoaderPromise: Promise<void> | null = null;

/**
 * Calculates Haversine distance in meters between two lat/lng coordinates
 */
export function calculateDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth's mean radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Estimates walking time in minutes based on distance (~80 meters / min by default)
 */
export function calculateWalkingMinutes(
  distanceMeters: number,
  speedMetersPerMin = WALKING_SPEED_METERS_PER_MIN
): number {
  return Math.max(1, Math.round(distanceMeters / speedMetersPerMin));
}

/**
 * Retrieves stored or configured Google Maps API Key
 * Checks primary key 'kwai_hing_gmaps_key', legacy key, and Vite env variable
 */
export function getGoogleMapsApiKey(): string {
  try {
    const primary = localStorage.getItem(PRIMARY_API_KEY_STORAGE);
    if (primary && primary.trim()) return primary.trim();

    const legacy = localStorage.getItem(LEGACY_API_KEY_STORAGE);
    if (legacy && legacy.trim()) return legacy.trim();
  } catch {
    // LocalStorage may fail in restricted/private environments
  }

  return (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();
}

/**
 * Saves Google Maps API Key to localStorage
 */
export function setGoogleMapsApiKey(apiKey: string): void {
  try {
    const trimmed = apiKey.trim();
    if (trimmed) {
      localStorage.setItem(PRIMARY_API_KEY_STORAGE, trimmed);
    } else {
      localStorage.removeItem(PRIMARY_API_KEY_STORAGE);
      localStorage.removeItem(LEGACY_API_KEY_STORAGE);
    }
  } catch (e) {
    console.warn('[GooglePlacesService] Failed to persist API key:', e);
  }
}

/**
 * Clears Google Maps API Key from localStorage
 */
export function clearGoogleMapsApiKey(): void {
  try {
    localStorage.removeItem(PRIMARY_API_KEY_STORAGE);
    localStorage.removeItem(LEGACY_API_KEY_STORAGE);
  } catch (e) {
    console.warn('[GooglePlacesService] Failed to clear API key:', e);
  }
}

/**
 * Dynamically loads Google Maps JavaScript API with Places library
 */
export function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  // Already loaded
  if (window.google?.maps?.places?.PlacesService) {
    return Promise.resolve();
  }

  if (scriptLoaderPromise) {
    return scriptLoaderPromise;
  }

  scriptLoaderPromise = new Promise<void>((resolve, reject) => {
    // Check if script tag exists
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );
    if (existing) {
      if (window.google?.maps?.places) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', (err) => reject(err));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey
    )}&libraries=places`;
    script.async = true;
    script.defer = true;

    const timeout = setTimeout(() => {
      scriptLoaderPromise = null;
      reject(new Error('Google Maps script loading timed out after 10 seconds'));
    }, 10000);

    script.onload = () => {
      clearTimeout(timeout);
      resolve();
    };

    script.onerror = (err) => {
      clearTimeout(timeout);
      scriptLoaderPromise = null;
      reject(new Error(`Failed to load Google Maps script: ${String(err)}`));
    };

    document.head.appendChild(script);
  });

  return scriptLoaderPromise;
}

/**
 * Determines Kwai Hing Zone based on address keywords and coordinate proximity
 */
function inferZone(
  name: string,
  address: string,
  lat: number,
  lng: number
): { zoneId: ZoneId; zoneName: string; isSheltered: boolean } {
  const combined = `${name} ${address}`.toLowerCase();

  // KCC (Kowloon Commerce Centre / life@KCC)
  if (
    combined.includes('kcc') ||
    combined.includes('九龍貿易中心') ||
    combined.includes('life@kcc') ||
    combined.includes('葵昌路51') ||
    combined.includes('葵昌路72')
  ) {
    return {
      zoneId: 'kcc',
      zoneName: '九龍貿易中心 (KCC)',
      isSheltered: true,
    };
  }

  // Sun Kwai Hing Plaza
  if (
    combined.includes('新葵興') ||
    combined.includes('sun kwai hing') ||
    combined.includes('興芳路166')
  ) {
    return {
      zoneId: 'sun-kwai-hing',
      zoneName: '新葵興廣場',
      isSheltered: true,
    };
  }

  // KC100 / Tai Lin Pai
  if (
    combined.includes('kc100') ||
    combined.includes('大連排') ||
    combined.includes('tai lin pai') ||
    combined.includes('葵榮路') ||
    combined.includes('工廈') ||
    combined.includes('工業')
  ) {
    return {
      zoneId: 'tai-lin-pai',
      zoneName: 'KC100 / 大連排工廈區',
      isSheltered: false,
    };
  }

  // Kwong Fai Circuit / Kwai Hing Estate
  if (
    combined.includes('光輝圍') ||
    combined.includes('葵興邨') ||
    combined.includes('禾塘咀') ||
    combined.includes('禾宜合')
  ) {
    return {
      zoneId: 'kwong-fai',
      zoneName: '光輝圍 / 葵興邨',
      isSheltered: false,
    };
  }

  // Proximity fallback to nearest zone center
  let closestZone = ZONES[0];
  let minDistance = Infinity;

  for (const zone of ZONES) {
    const center = zone.center || KWAI_HING_COORDINATES;
    const dist = calculateDistanceMeters(lat, lng, center.lat, center.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestZone = zone;
    }
  }

  return {
    zoneId: closestZone.id,
    zoneName: closestZone.nameZh || closestZone.name || '葵興食肆',
    isSheltered: Boolean(closestZone.isSheltered),
  };
}

/**
 * Infers cuisine tags and human-readable label from place types and names
 */
function inferCuisine(
  types: string[] = [],
  name: string = ''
): { tags: string[]; label: string; code: string } {
  const combined = `${types.join(' ')} ${name}`.toLowerCase();

  if (combined.includes('cafe') || combined.includes('coffee') || combined.includes('咖啡')) {
    return { tags: ['cafe', 'western'], label: '精品咖啡 / 輕食', code: 'western' };
  }
  if (
    combined.includes('sushi') ||
    combined.includes('japanese') ||
    combined.includes('日式') ||
    combined.includes('壽司') ||
    combined.includes('拉麵')
  ) {
    return { tags: ['japanese'], label: '日式料理 / 壽司', code: 'japanese_korean' };
  }
  if (
    combined.includes('noodle') ||
    combined.includes('米線') ||
    combined.includes('車仔麵') ||
    combined.includes('粉麵')
  ) {
    return { tags: ['noodles'], label: '粉麵水餃 / 車仔麵', code: 'noodles_congee' };
  }
  if (
    combined.includes('茶餐廳') ||
    combined.includes('冰室') ||
    combined.includes('cha chaan teng')
  ) {
    return { tags: ['cha-chaan-teng'], label: '港式茶記', code: 'hk_cafe' };
  }
  if (
    combined.includes('酒家') ||
    combined.includes('點心') ||
    combined.includes('dim sum') ||
    combined.includes('燒味') ||
    combined.includes('中菜')
  ) {
    return { tags: ['chinese'], label: '中菜點心 / 燒味', code: 'chinese' };
  }
  if (
    combined.includes('thai') ||
    combined.includes('viet') ||
    combined.includes('泰') ||
    combined.includes('越') ||
    combined.includes('東南亞')
  ) {
    return { tags: ['southeast-asian'], label: '東南亞風味', code: 'asian' };
  }
  if (
    combined.includes('burger') ||
    combined.includes('mcdonald') ||
    combined.includes('kfc') ||
    combined.includes('快餐')
  ) {
    return { tags: ['fastfood'], label: '連鎖快餐', code: 'fast_food' };
  }
  if (
    combined.includes('salad') ||
    combined.includes('healthy') ||
    combined.includes('poke') ||
    combined.includes('素食')
  ) {
    return { tags: ['healthy'], label: '健康低卡 / 沙律', code: 'fast_food' };
  }
  if (combined.includes('雙餸') || combined.includes('兩餸')) {
    return { tags: ['two-dishes'], label: '雙餸飯 / 快餐盒飯', code: 'hk_cafe' };
  }
  if (combined.includes('steak') || combined.includes('western') || combined.includes('西餐')) {
    return { tags: ['western'], label: '西式意粉 / 排餐', code: 'western' };
  }

  return { tags: ['cha-chaan-teng'], label: '港式茶記', code: 'hk_cafe' };
}

/**
 * Infers scenario tags based on zone, cuisine, price, and place properties
 */
function inferScenarios(
  isSheltered: boolean,
  priceLevel: PriceLevel,
  cuisineTags: string[]
): string[] {
  const scenarios: string[] = [];

  if (isSheltered) {
    scenarios.push('rainy');
    scenarios.push('rainy_day');
  }

  if (priceLevel === 1) {
    scenarios.push('budget');
  }

  if (
    cuisineTags.includes('fastfood') ||
    cuisineTags.includes('noodles') ||
    cuisineTags.includes('two-dishes')
  ) {
    scenarios.push('quick');
    scenarios.push('quick_bite');
  }

  if (cuisineTags.includes('cafe') || cuisineTags.includes('japanese')) {
    scenarios.push('chill');
    scenarios.push('chill_cafe');
  }

  if (
    cuisineTags.includes('chinese') ||
    cuisineTags.includes('western') ||
    cuisineTags.includes('southeast-asian')
  ) {
    scenarios.push('team');
    scenarios.push('gathering');
  }

  if (cuisineTags.includes('healthy') || cuisineTags.includes('cafe')) {
    scenarios.push('healthy');
  }

  if (scenarios.length === 0) {
    scenarios.push('quick');
  }

  return [...new Set(scenarios)];
}

/**
 * Converts a Google PlaceResult object to the Restaurant interface
 */
function transformPlaceToRestaurant(
  place: google.maps.places.PlaceResult
): Restaurant {
  const lat =
    typeof place.geometry?.location?.lat === 'function'
      ? place.geometry.location.lat()
      : KWAI_HING_COORDINATES.lat;
  const lng =
    typeof place.geometry?.location?.lng === 'function'
      ? place.geometry.location.lng()
      : KWAI_HING_COORDINATES.lng;

  const distanceMeters = calculateDistanceMeters(
    KWAI_HING_COORDINATES.lat,
    KWAI_HING_COORDINATES.lng,
    lat,
    lng
  );
  const walkingMinutes = calculateWalkingMinutes(distanceMeters);

  const name = place.name || '葵興食肆';
  const address = place.vicinity || place.formatted_address || '香港新界葵涌葵興';
  const zoneInfo = inferZone(name, address, lat, lng);
  const cuisineInfo = inferCuisine(place.types, name);

  const rawPriceLevel = place.price_level ?? 2;
  const priceLevel: PriceLevel = (
    rawPriceLevel >= 1 && rawPriceLevel <= 4 ? rawPriceLevel : 2
  ) as PriceLevel;

  const isSheltered = Boolean(zoneInfo.isSheltered);
  const scenarios = inferScenarios(isSheltered, priceLevel, cuisineInfo.tags);

  const photos: string[] = [];
  if (place.photos && place.photos.length > 0) {
    for (const p of place.photos.slice(0, 3)) {
      try {
        photos.push(p.getUrl({ maxWidth: 800, maxHeight: 600 }));
      } catch {
        // Ignore individual photo extraction failure
      }
    }
  }

  if (photos.length === 0) {
    photos.push(
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
    );
  }

  const openNow: boolean =
    typeof place.opening_hours?.isOpen === 'function'
      ? Boolean(place.opening_hours.isOpen())
      : Boolean(place.opening_hours?.open_now ?? true);

  const openingHours =
    place.opening_hours?.weekday_text && place.opening_hours.weekday_text.length > 0
      ? place.opening_hours.weekday_text
      : ['營業時間依官方公佈為準'];

  const placeId = place.place_id || `gplace-${Math.random().toString(36).slice(2, 9)}`;
  const googleMapsUrl = place.place_id
    ? `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${name} ${address}`
      )}`;

  const recommendationDish = `招牌精選（${cuisineInfo.label}推薦）`;

  return {
    id: placeId,
    name,
    nameEn: name,
    zoneId: zoneInfo.zoneId,
    address,
    lat,
    lng,
    rating: Number((place.rating ?? 4.2).toFixed(1)),
    userRatingsTotal: place.user_ratings_total ?? 0,
    priceLevel,
    photos,
    openNow,
    openingHours,
    walkingMinutesFromMTR: walkingMinutes,
    distanceMeters,
    cuisineTags: cuisineInfo.tags,
    scenarios,
    phone: place.formatted_phone_number || '',
    googlePlaceId: placeId,
    googleMapsUrl,
    isSheltered,
    description: `${name} 位於${address}，步行約 ${walkingMinutes} 分鐘即可由葵興站抵達。`,
    recommendationDish,
    // UI compatibility fields
    imageUrl: photos[0],
    photo: photos[0],
    walkingMinutes,
    zone: zoneInfo.zoneId,
    zoneLabel: zoneInfo.zoneName,
    zoneName: zoneInfo.zoneName,
    cuisine: cuisineInfo.code,
    cuisineLabel: cuisineInfo.label,
    cuisineType: cuisineInfo.code,
    priceRange:
      priceLevel === 1
        ? '<$50'
        : priceLevel === 2
        ? '$51-100'
        : priceLevel === 3
        ? '$101-200'
        : '$200+',
    reviewCount: place.user_ratings_total ?? 0,
    highlightDish: recommendationDish,
    highlights: [recommendationDish],
    popularDishes: [recommendationDish],
    tags: [
      isSheltered ? '🌧️ 天橋直達' : '🚶 街頭地道',
      `🚶 步行 ${walkingMinutes} 分鐘`,
      `⭐ ${Number((place.rating ?? 4.2).toFixed(1))}`,
    ],
    walkDirections: `由葵興站出發步行約 ${walkingMinutes} 分鐘（${distanceMeters}米）`,
    walkingDirections: `由葵興站出發步行約 ${walkingMinutes} 分鐘（${distanceMeters}米）`,
    source: 'google_places',
    coordinates: { lat, lng },
    isOpenNow: openNow,
    openingHoursText: openingHours.join(' | '),
  };
}

/**
 * Searches nearby restaurants using Google Places PlacesService
 */
function runNearbySearch(
  service: google.maps.places.PlacesService,
  request: google.maps.places.PlaceSearchRequest
): Promise<google.maps.places.PlaceResult[]> {
  return new Promise((resolve, reject) => {
    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        resolve(results);
      } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resolve([]);
      } else {
        reject(new Error(`PlacesService nearbySearch failed with status: ${status}`));
      }
    });
  });
}

/**
 * Primary integration function:
 * Fetches nearby Kwai Hing restaurants via Google Places API if key is available,
 * and falls back seamlessly to the 30 curated Kwai Hing seed places on error or missing key.
 */
export async function fetchKwaiHingPlaces(apiKey?: string): Promise<Restaurant[]> {
  const activeKey = (apiKey || getGoogleMapsApiKey()).trim();

  // If no API key provided, fall back immediately to seed data
  if (!activeKey) {
    console.info(
      '[GooglePlacesService] No API key detected. Seamlessly using Kwai Hing seed places.'
    );
    return kwaiHingSeedPlaces;
  }

  try {
    // Attempt to load Google Maps script
    await loadGoogleMapsScript(activeKey);

    if (!window.google?.maps?.places?.PlacesService) {
      throw new Error('Google Places library unavailable after script load');
    }

    const dummyDiv = document.createElement('div');
    const service = new google.maps.places.PlacesService(dummyDiv);

    const location = new google.maps.LatLng(
      KWAI_HING_COORDINATES.lat,
      KWAI_HING_COORDINATES.lng
    );

    // Perform nearby search for restaurants around Kwai Hing
    const rawResults = await runNearbySearch(service, {
      location,
      radius: SEARCH_RADIUS_METERS,
      type: 'restaurant',
    });

    if (!rawResults || rawResults.length === 0) {
      console.warn(
        '[GooglePlacesService] Google Places returned 0 results. Falling back to seed places.'
      );
      return kwaiHingSeedPlaces;
    }

    // Transform and enrich results
    const places = rawResults.map(transformPlaceToRestaurant);
    console.info(
      `[GooglePlacesService] Successfully loaded ${places.length} places from Google Places API.`
    );
    return places;
  } catch (err) {
    console.warn(
      '[GooglePlacesService] Error fetching Google Places. Gracefully falling back to seed places:',
      err
    );
    return kwaiHingSeedPlaces;
  }
}

/**
 * Service singleton object for easy import
 */
export const googlePlacesService = {
  fetchKwaiHingPlaces,
  getApiKey: getGoogleMapsApiKey,
  setApiKey: setGoogleMapsApiKey,
  clearApiKey: clearGoogleMapsApiKey,
  calculateDistanceMeters,
  calculateWalkingMinutes,
  loadScript: loadGoogleMapsScript,
  loadGoogleMapsScript,
};

export default googlePlacesService;
