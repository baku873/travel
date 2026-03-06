import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserBookings } from "@/lib/mongo/bookings";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const bookings = await getUserBookings(userId);

        return NextResponse.json({ bookings }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching user bookings:", error);
        return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }
}
