// app/admin/comments/page.tsx
import CommentsManager from "./CommentsManager";
import clientPromise from "@/lib/mongo";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Force dynamic because we want real-time admin data
export const dynamic = "force-dynamic";

export default async function AdminCommentsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const client = await clientPromise;
  const db = client.db("travel_db");

  // Fetch ALL comments (including pending/rejected) for admin
  const comments = await db
    .collection("comments")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  // Convert _id to string for Client Component
  const serializedComments = comments.map(c => ({
    ...c,
    _id: c._id.toString()
  }));

  return (
    <div className="p-8">
      {/* @ts-ignore */}
      <CommentsManager initialComments={serializedComments} />
    </div>
  );
}