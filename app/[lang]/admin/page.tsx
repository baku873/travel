import clientPromise from "@/lib/mongo";
import AdminDashboardClient from "./AdminDashboardCleint";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // No need for security check here, layout.tsx handles it

  const client = await clientPromise;
  const db = client.db("travel_db");

  // Fetch stats in parallel
  const [tripsCount, postsCount] = await Promise.all([
    db.collection("trips").countDocuments(),
    db.collection("posts").countDocuments()
  ]);

  const stats = {
    trips: tripsCount,
    blogs: postsCount,
    // Add more stats as needed (e.g., users, bookings)
    users: 0, 
    bookings: 0
  };

  return (
    <div className="pt-24 p-8">
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
            <p className="text-slate-500">A quick look at your travel site's data.</p>
        </header>
        <AdminDashboardClient stats={stats} />
    </div>
  );
}