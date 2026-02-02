import clientPromise from "@/lib/mongo";
import TripsManager from "./TripsManager";

export const dynamic = "force-dynamic";

export default async function AdminTripsPage() {
  const client = await clientPromise;
  const db = client.db("travel_db");

  // Optimize: Fetch only necessary fields for the list view to prevent OOM
  const tripsRaw = await db.collection("trips").find({})
    .project({
      title: 1,
      image: 1,
      dates: 1,
      createdAt: 1,
      // Minimal fields needed for list display
    })
    .sort({ createdAt: -1 })
    .toArray();

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