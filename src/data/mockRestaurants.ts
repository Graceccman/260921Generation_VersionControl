import { SEED_RESTAURANTS, SUB_ZONES, SCENARIOS as CONFIG_SCENARIOS } from '../config/kwaiHingConfig';
import type { Restaurant, ZoneMeta, ScenarioMeta } from '../types/restaurant';

export const MOCK_RESTAURANTS: Restaurant[] = SEED_RESTAURANTS;
export const ZONES: ZoneMeta[] = SUB_ZONES as any;
export const SCENARIOS: ScenarioMeta[] = CONFIG_SCENARIOS as any;
