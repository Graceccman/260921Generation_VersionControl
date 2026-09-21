const API_KEY_STORAGE = 'ghfood_google_api_key';
const FAVORITES_STORAGE = 'ghfood_favorite_ids';
const RECENT_PICKS_STORAGE = 'ghfood_recent_picks';

export const storageService = {
  getApiKey(): string {
    try {
      const stored = localStorage.getItem(API_KEY_STORAGE);
      if (stored) return stored.trim();
    } catch {
      // ignore
    }
    // Fallback to env variable if present in build/dev
    return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  },

  setApiKey(key: string): void {
    try {
      if (!key) {
        localStorage.removeItem(API_KEY_STORAGE);
      } else {
        localStorage.setItem(API_KEY_STORAGE, key.trim());
      }
    } catch (e) {
      console.error('Failed to save API key to localStorage', e);
    }
  },

  getFavorites(): string[] {
    try {
      const raw = localStorage.getItem(FAVORITES_STORAGE);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  toggleFavorite(restaurantId: string): string[] {
    try {
      const current = this.getFavorites();
      const updated = current.includes(restaurantId)
        ? current.filter((id) => id !== restaurantId)
        : [...current, restaurantId];
      localStorage.setItem(FAVORITES_STORAGE, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  getRecentPicks(): { id: string; timestamp: number }[] {
    try {
      const raw = localStorage.getItem(RECENT_PICKS_STORAGE);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  recordPick(restaurantId: string): void {
    try {
      const picks = this.getRecentPicks().filter((p) => p.id !== restaurantId);
      picks.unshift({ id: restaurantId, timestamp: Date.now() });
      localStorage.setItem(RECENT_PICKS_STORAGE, JSON.stringify(picks.slice(0, 10)));
    } catch (e) {
      console.error('Failed to record recent pick', e);
    }
  },
};
