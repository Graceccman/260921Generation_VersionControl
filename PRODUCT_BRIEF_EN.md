# Product Brief
# 「Kwai Hing Eats / 葵興食乜好」

---

## 1. Executive Summary

- **Product Name**: Kwai Hing Eats (葵興食乜好)
- **Core Positioning**: A **hyper-local, fast restaurant discovery & decision-making tool** purpose-built for people working and living around Kwai Hing, Hong Kong.
- **Core Question**:
  > **"What should we eat today?" (今日食咩？)**
- **Product Format**: Lightweight, mobile-first responsive web application.
- **One-Sentence Vision**: Eliminate lunchtime decision fatigue and help Kwai Hing workers decide where to eat in under 30 seconds.

---

## 2. Problem Statement & Market Pain Points

### 2.1 Geographic & Lifestyle Context
Kwai Hing is a unique convergence of modern commercial office towers and traditional industrial blocks (Kowloon Commerce Centre [KCC], KC100, Tai Lin Pai Road industrial area, Sun Kwai Hing Plaza, and Kwong Fai Circuit):
1. **Compressed Lunch Breaks**: Workday lunch hours are typically 45–60 minutes. Long queues at elevators and restaurants leave minimal time for deliberation.
2. **Decision Fatigue ("今日食咩？")**: Every day at 12:30 PM, colleagues ask the same question without an efficient way to narrow down options.
3. **Severe Weather Sensitivity**: In heavy rain or humid summer heat, office workers heavily favor covered, air-conditioned footbridge networks to avoid having to open an umbrella.
4. **Information Overload over Decision Velocity**: Generic platforms (e.g., OpenRice, Google Maps) focus on exhaustive directory listings, lengthy reviews, and paid advertisements. They fail to cater to rapid, context-aware lunchtime decisions.

### 2.2 Our Value Proposition
We are **not an OpenRice clone**, nor are we trying to recreate Google Maps:
- **Decision-First UX**: With a 1-click randomizer ("Help Me Pick!") and 6 intuitive mood/scenario filters, decision time is slashed from 10 minutes to under 30 seconds.
- **Hyper-Local Context**: Exact walking minutes from Kwai Hing MTR exits (Exits A, B, E) and covered footbridge connectivity indicators.
- **Zero Friction**: No sign-up required, zero ads, no bloatware, instant loading.

---

## 3. Target Audience & User Personas

| Persona | Background | Key Pain Point & Need | Recommended Feature |
| :--- | :--- | :--- | :--- |
| **Persona A: Rushed Office Worker** | FinTech/Corporate workers relocated to KCC / Kwai Cheong Rd | Only 45 mins; needs rapid table turnover or fast takeaway | ⚡️ **"Quick Bite" (急急子)** filter, walking minutes |
| **Persona B: Rain Dodger** | Workers near Kwai Hing station on rainy or scorching days | Wants fully covered, air-conditioned walkways without carrying an umbrella | 🌧️ **"Rain Shelter" (落雨唔想淋)** footbridge filter |
| **Persona C: Budget Seeker** | Industrial building staff, neighborhood residents | Cost-conscious (end-of-month budget); seeks <$60 meals, cart noodles, 2-dish rice | 💰 **"Value for Money" (平靚正)** price tier filter |
| **Persona D: Slow-Paced Creative / Casual Business** | Freelancers, agency creatives, field reps | Requires quiet ambience, good natural light, specialty coffee, and seating for talks | ☕️ **"Chill & Chat" (慢慢嘆 / 傾偈)**, industrial cafes |
| **Persona E: Team Lunch Organizer** | Department admins, team leads hosting newcomers | 4–8 people gathering; needs large tables, Chinese dim sum, or Korean BBQ | 👥 **"Team Lunch" (同事聚餐)** tag |

---

## 4. Product Principles & Non-Goals

### 4.1 Core Design Principles
1. **Speed to Decision**: Any user journey must lead to an actionable dining recommendation in 3 clicks or fewer.
2. **Human-Centered & Local**: Embraces authentic Hong Kong colloquial terms (e.g., "急急子", "平靚正", "落雨唔想淋").
3. **Zero Bloat**: Practical engineering; no unnecessary database overhead or speculative complexity.

### 4.2 Non-Goals
- ❌ **Not a Food Delivery Platform**: No in-app food ordering, payment gateways, or courier dispatch.
- ❌ **Not a Long-Form Review Social Network**: No essay-length user reviews; focuses purely on star ratings, review counts, and signature dishes.
- ❌ **Not an All-Hong Kong Directory**: Strictly scoped to the Kwai Hing district radius (~800m–1000m).

---

## 5. Core Feature Specifications

### 5.1 "Help Me Pick!" Lucky Draw Decision Engine (幫我揀！)
- **Roulette / Card Draw Animation**: Randomly picks an eatery from the currently filtered pool.
- **Celebration Feedback**: Triggers confetti (`canvas-confetti`) and synthesized audio chimes (Web Audio API) upon winning selection.
- **Dual Calls-to-Action (CTA)**:
  - **"Let's Eat Here!"**: Launches immediate turn-by-turn walking directions in Google Maps.
  - **"Not This One, Re-spin 🔄"**: Smoothly draws the next candidate.

### 5.2 6 Workday Lifestyle Scenarios (情境快選)
- ⚡️ **Quick Bite (急急子)**: 15-minute quick meals, fast takeout line.
- 🌧️ **Rain Shelter (落雨唔想淋)**: Fully covered, air-conditioned footbridge access from MTR (KCC / Sun Kwai Hing Plaza).
- 💰 **Value for Money (平靚正)**: Meals under HK$60 (local Cha Chaan Teng, noodles, cart noodles).
- ☕️ **Chill & Chat (慢慢嘆 / 傾偈)**: Cozy cafes, Japanese set meals, relaxed conversations.
- 👥 **Team Lunch (同事聚餐)**: Large tables, Chinese dim sum, Korean BBQ, shared plates.
- 🥗 **Healthy & Light (健康輕食)**: Salad bowls, poke, low-calorie options.

### 5.3 4 Local Kwai Hing Sub-Zones (葵興在地分區)
- **All Zones**: Full Kwai Hing curated selection.
- **🏢 KCC (Kowloon Commerce Centre)**: Grade-A commercial hub, footbridge-connected, modern chains.
- **🚉 Sun Kwai Hing Plaza**: MTR Exit B concourse connection, transit interchange food.
- **🏭 KC100 & Tai Lin Pai Industrial Area**: Hidden industrial cafes, canteen favorites, high value-for-money.
- **🏘️ Kwong Fai Circuit / Kwai Hing Estate**: Authentic local food street, cart noodles, congee, late-night bites.

### 5.4 Dual Visual View Modes
- **Card / List View**: High-quality imagery, walking minutes, signature dish badges, price level, and ratings.
- **Interactive Map View**: Centered on Kwai Hing MTR with color-coded zone pins and interactive preview popups.

### 5.5 Bookmarking / Favorites Drawer
- Bookmark favorites locally with 1-click heart icon.
- Option to spin the decision wheel exclusively from saved favorites.

---

## 6. Technical Architecture & Constraints

### 6.1 Strict "No Database" Constraint
- **No SQL or NoSQL Databases**: Does not use PostgreSQL, MySQL, MongoDB, Firebase, Supabase, or SQLite.
- **Dual-Track Data Engine**:
  1. **Google Places API / Google Maps JS API**: Direct client-side integration supporting dynamic nearby searches and place details.
  2. **Curated Seed Engine**: 28+ authentic Kwai Hing eateries with verified coordinates, real photos, opening hours, and signature dishes for immediate offline/demo readiness without requiring an API key.

### 6.2 System Architecture Overview
```
[ Browser Client ]
   ├── UI Components (Header, ScenarioBar, ZoneTabs, FilterBar, RestaurantGrid, DecisionMaker)
   ├── Client Services
   │    ├── GooglePlacesService (Maps JS API loader + PlacesService nearbySearch)
   │    └── StorageService (LocalStorage: API Key, Favorites, Recent Picks)
   └── Data Layer
        └── KwaiHingConfig (Center Coordinates, Sub-Zones, Scenarios, 28+ Curated Seed Places)
```

### 6.3 Tech Stack
- **Framework**: React 19 + TypeScript
- **Bundler & Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4
- **Iconography**: Lucide React
- **Micro-Interactions**: canvas-confetti, Web Audio API

---

## 7. Key Success Metrics

1. **Time-to-Decision**: Median time from app launch to final dining selection $\le 30$ seconds.
2. **Decision Engine Adoption Rate**: $\ge 40\%$ of active visitors use "Help Me Pick!" or Scenario quick filters.
3. **Navigation Conversion Rate (CTR)**: $\ge 25\%$ of users click the direct Google Maps navigation button.
4. **Performance**: Google Lighthouse Performance score $\ge 95$; First Contentful Paint (FCP) $\le 0.8$ seconds.

---

## 8. Product Roadmap

- **Phase 1 (Current MVP Release)**:
  - ✅ Complete Decision Wheel, 6 Scenarios, 4 Sub-Zones, Zero-Database Architecture, Google Places API client service, and curated seed dataset.
- **Phase 2 (Upcoming Enhancements)**:
  - 🕒 **Afternoon Tea Mode (下午茶)**: Automatically switches recommendations to tea-time sets, fried chicken wings, and French toast after 2:30 PM.
  - ☔ **HK Observatory Weather Integration**: Automatically pre-activates the "Rain Shelter" mode when rainfall is detected in Kwai Tsing district.
- **Phase 3 (Social & Sharing)**:
  - 🔗 **WhatsApp Decision Card Sharing**: One-click sharing of the winning restaurant card directly to team chat groups.
