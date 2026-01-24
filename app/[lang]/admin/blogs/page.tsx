import clientPromise from "@/lib/mongo"; // Adjust path if needed
import BlogsManager from "./BlogsManager"; // Adjust path if needed
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  // 1. Security check - although the layout handles this, it's good practice
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/");
  }

  // 2. Fetch all blog posts from the database
  const client = await clientPromise;
  const db = client.db("travel_db"); // Ensure your DB name is correct
  const postsRaw = await db.collection("posts").find({}).sort({ date: -1 }).toArray();

  // 3. Serialize the data to pass to the Client Component
  // This converts MongoDB's ObjectId to a simple string
  const posts = postsRaw.map(doc => {
    const { _id, ...rest } = doc;
    return {
      ...rest,
      _id: _id.toString(),
    };
  });

  return (
    <div className="pt-24 p-8">
      {/* 
        The sidebar is handled by layout.tsx, so this page only needs to render
        the main content area inside the layout's {children}.
      */}
      <BlogsManager initialPosts={posts as any} />
    </div>
  );
}