
import clientPromise from "./index";

const DB_NAME = "travel_db";
const COLLECTION = "custom_trips";

export interface CustomTripInquiry {
    _id?: string;
    adults: number;
    children: number;
    infants: number;
    ages: string[];
    hotel: string;
    interests: string[];
    arrivalDate: string;
    isFlexible: boolean;
    duration: string;
    budget: string;
    otherIdeas: string;
    fullName: string;
    email: string;
    nationality: string;
    phone: string;
    createdAt: Date;
    status: "pending" | "contacted" | "resolved";
}

export async function createCustomTripInquiry(data: Omit<CustomTripInquiry, "_id" | "createdAt" | "status">) {
    const client = await clientPromise;
    const collection = client.db(DB_NAME).collection(COLLECTION);

    const result = await collection.insertOne({
        ...data,
        createdAt: new Date(),
        status: "pending"
    });

    return { ...data, _id: result.insertedId.toString() };
}
