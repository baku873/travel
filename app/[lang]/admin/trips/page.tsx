import clientPromise from "@/lib/mongo";
import TripsManager from "./TripsManager";

export const dynamic = "force-dynamic";

export default async function AdminTripsPage() {
  const client = await clientPromise;
  const db = client.db("travel_db");

  const tripsRaw = await db.collection("trips").find({}).sort({ createdAt: -1 }).toArray();

  // Serialize data to pass from Server to Client
  const trips = tripsRaw.map(doc => {
    const { _id, ...rest } = doc;
    return {
      ...rest,
      _id: _id.toString(),
    };
  });

  return (
    <div className="pt-24 p-8">
      <TripsManager initialTrips={trips as any} />
    </div>
  );
}