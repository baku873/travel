import { ObjectId } from "mongodb";
import { unstable_cache } from "next/cache";

import clientPromise from "./index";

const DB_NAME = "travel_db";
const COLLECTION = "trips";
export interface LocalizedString {
  mn: string;
  en: string;
  ko: string;
  de: string;
}
export interface TripDate {
  id: string;
  startDate: string;
  endDate: string;
  maxSeats: number;
  bookedSeats: number;
  priceModifier?: number;
}
export interface ItineraryItem {
  day: number;
  title: LocalizedString;
  desc: LocalizedString;
  accommodation?: string;
  meals?: { B: boolean; L: boolean; D: boolean };
  B?: boolean;
  L?: boolean;
  D?: boolean;
  imageUrl?: string;
  hotelCost?: number;
  transportCost?: number;
}
export interface LocalizedPrice {
  mn: number;
  en: number;
  ko: number;
  de: number;
}
export interface PointOfInterest {
  lat: number;
  lng: number;
  title: string;
  image?: string;
}

export interface Trip {
  _id: string;
  type?: string;
  region?: string;
  title: LocalizedString;
  location: LocalizedString;
  duration: LocalizedString;
  description?: LocalizedString;
  ageGroup?: LocalizedString;
  category: string;
  rating: number;
  image: string;
  price: LocalizedPrice;
  priceAdult?: LocalizedPrice;
  priceChild?: LocalizedPrice;
  salePrice?: LocalizedPrice;
  discountPercentage?: number;
  tags?: string[];
  featured?: boolean;
  oldPrice?: number;
  reviews?: number;
  perks?: string[];
  highlights?: LocalizedString[];
  includedServices?: LocalizedString[];
  excludedServices?: LocalizedString[];
  saleMonth?: number;
  seatsLeft?: number;
  itinerary?: ItineraryItem[];
  availableDates?: { date: string; status: string; isFull?: boolean }[];
  allowCustomDate?: boolean;
  season_availability?: string;
  dates: TripDate[];
  verified?: boolean;
  coordinates?: [number, number];
  elevationData?: { distance: number; elevation: number }[];
  gpxUrl?: string;
  pointsOfInterest?: PointOfInterest[];
}
function mapTrip(doc: any): Trip {
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}

/* ──────────────────────────────────────────────────────
   DATA FETCHING FUNCTIONS
────────────────────────────────────────────────────── */

// 1. Get ALL trips
export const getAllTrips = unstable_cache(
  async () => {
    const client = await clientPromise;
    const collection = client.db(DB_NAME).collection(COLLECTION);
    const trips = await collection.find({}).sort({ featured: -1, _id: -1 }).toArray();
    return trips.map(mapTrip);
  },
  ['all-trips'],
  { revalidate: 3600, tags: ['trips'] }
);

// 2. Get Trips by generic 'type' (family, solo, etc)
export const getTripsByType = unstable_cache(
  async (type: string) => {
    const client = await clientPromise;
    const collection = client.db(DB_NAME).collection(COLLECTION);
    const trips = await collection.find({ type: type }).toArray();
    return trips.map(mapTrip);
  },
  ['trips-by-type'],
  { revalidate: 3600, tags: ['trips'] }
);

// 3. Get Trips by REGION (Europe/Mongolia)
export const getTripsByRegion = unstable_cache(
  async (region: string) => {
    const client = await clientPromise;
    const collection = client.db(DB_NAME).collection(COLLECTION);
    const trips = await collection.find({ region: region }).toArray();
    return trips.map(mapTrip);
  },
  ['trips-by-region'],
  { revalidate: 3600, tags: ['trips'] }
);

// 4. Specific Region Helpers
export async function getEuropeTrips() {
  return getTripsByRegion("europe");
}

export async function getMongoliaTrips() {
  return getTripsByRegion("mongolia");
}

// 5. Get Featured trips
export const getFeaturedTrips = unstable_cache(
  async () => {
    const client = await clientPromise;
    const collection = client.db(DB_NAME).collection(COLLECTION);
    const trips = await collection.find({ featured: true }).limit(5).toArray();
    return trips.map(mapTrip);
  },
  ['featured-trips'],
  { revalidate: 3600, tags: ['trips'] }
);

// 6. Get Recent trips
export const getRecentTrips = unstable_cache(
  async () => {
    const client = await clientPromise;
    const collection = client.db(DB_NAME).collection(COLLECTION);
    const trips = await collection.find({}).sort({ _id: -1 }).limit(6).toArray();
    return trips.map(mapTrip);
  },
  ['recent-trips'],
  { revalidate: 3600, tags: ['trips'] }
);

// 7. Get Family trips
export async function getFamilyTrips() {
  return getTripsByType("family");
}

// 8. Get Honeymoon trips
export async function getHoneymoonTrips() {
  return getTripsByType("honeymoon");
}

// 9. Get Solo trips
export async function getSoloTrips() {
  return getTripsByType("solo");
}

// 10. Get Sale trips
export const getSaleTrips = unstable_cache(
  async () => {
    const client = await clientPromise;
    const collection = client.db(DB_NAME).collection(COLLECTION);
    const trips = await collection
      .find({ oldPrice: { $exists: true, $ne: null } })
      .sort({ price: 1 })
      .toArray();
    return trips.map(mapTrip);
  },
  ['sale-trips'],
  { revalidate: 3600, tags: ['trips'] }
);

// 11. Get Single Trip by ID
const _cachedGetTripById = unstable_cache(
  async (id: string) => {
    const client = await clientPromise;
    const collection = client.db(DB_NAME).collection(COLLECTION);
    try {
      const trip = await collection.findOne({ _id: new ObjectId(id) });
      return trip ? mapTrip(trip) : null;
    } catch {
      return null;
    }
  },
  ['trip-by-id'],
  { revalidate: 3600, tags: ['trips'] }
);

export const getTripById = (id: string) => _cachedGetTripById(id);

// 12. Get Recommendations based on interests/budget
export async function getRecommendations(preferences: any) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  const query: any = {};
  if (preferences.interests && preferences.interests.length > 0) {
    query.$or = [
      { tags: { $in: preferences.interests } },
      { category: { $in: preferences.interests } }
    ];
  }
  if (preferences.budget) {
    const budgetNum = parseInt(preferences.budget);
    if (!isNaN(budgetNum)) {
      query["price.en"] = { $lte: budgetNum * 1.2 };
    }
  }
  const trips = await collection.find(query).limit(3).toArray();
  return trips.map(mapTrip);
}