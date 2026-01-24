import { ObjectId } from "mongodb";
import clientPromise from "./index";

const DB_NAME = "travel_db";
const COLLECTION = "trips";
export interface LocalizedString {
  mn: string;
  en: string;
  ko: string;
}
export interface TripDate {
  id: string;           // Unique ID for this specific group (e.g., "group_01")
  startDate: string;    // ISO Date "2025-10-10"
  endDate: string;      // ISO Date "2025-10-17"
  maxSeats: number;     // Capacity for this specific date
  bookedSeats: number;  // How many people booked (calculated from bookings)
  priceModifier?: number; // Optional: extra cost for peak season
}
export interface ItineraryItem {
  day: number;
  title: LocalizedString; // Changed from string
  desc: LocalizedString;  // Changed from string
}
export interface LocalizedPrice {
  mn: number;
  en: number;
  ko: number;
}
export interface Trip {
  _id: string;
  type?: string;
  region?: string;
  
  // Update these to LocalizedString
  title: LocalizedString;
  location: LocalizedString;
  duration: LocalizedString;
  description?: LocalizedString; 
  ageGroup?: LocalizedString;

  category: string;
  rating: number;
  image: string;
  price: LocalizedPrice;
  priceAdult?: LocalizedPrice; // New: Adult Price
  priceChild?: LocalizedPrice; // New: Child Price
  salePrice?: LocalizedPrice;  // New: Discounted Price (overrides priceAdult)
  tags?: string[];
  featured?: boolean;
  oldPrice?: number;
  reviews?: number;
  perks?: string[];
  saleMonth?: number;
  seatsLeft?: number;
  itinerary?: ItineraryItem[];
  availableDates?: { date: string; status: string }[]; // New flexible dates
  dates: TripDate[];
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
export async function getAllTrips() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  const trips = await collection
    .find({})
    .sort({ featured: -1, _id: -1 }) 
    .toArray();

  return trips.map(mapTrip);
}

// 2. Get Trips by generic 'type' (family, solo, etc)
export async function getTripsByType(type: string) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  const trips = await collection
    .find({ type: type })
    .toArray();

  return trips.map(mapTrip);
}

// 3. ✨ NEW: Get Trips by REGION (Europe/Mongolia)
export async function getTripsByRegion(region: string) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  const trips = await collection
    .find({ region: region })
    .toArray();

  return trips.map(mapTrip);
}

// 4. ✨ NEW: Specific Region Helpers
export async function getEuropeTrips() {
  return getTripsByRegion("europe");
}

export async function getMongoliaTrips() {
  return getTripsByRegion("mongolia");
}

// 5. Get Featured trips
export async function getFeaturedTrips() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  const trips = await collection
    .find({ featured: true })
    .limit(5)
    .toArray();

  return trips.map(mapTrip);
}

// 6. Get Recent trips
export async function getRecentTrips() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  const trips = await collection
    .find({})
    .sort({ _id: -1 }) 
    .limit(6)
    .toArray();

  return trips.map(mapTrip);
}

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
export async function getSaleTrips() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  const trips = await collection
    .find({ 
      oldPrice: { $exists: true, $ne: null } 
    })
    .sort({ price: 1 })
    .toArray();

  return trips.map(mapTrip);
}

// 11. Get Single Trip by ID
export async function getTripById(id: string) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);

  try {
    const trip = await collection.findOne({ _id: new ObjectId(id) });
    return trip ? mapTrip(trip) : null;
  } catch (error) {
    return null;
  }
}