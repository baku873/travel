import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserBookings } from "@/lib/mongo/bookings";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  // Fetch from DB
  const bookings = await getUserBookings(userId);

  return (
    <DashboardClient 
      bookings={bookings as any} 
      userName={user.firstName || "Traveler"} 
      userImage={user.imageUrl}
      isAdmin={user.publicMetadata?.role === "admin"}
    />
  );
}