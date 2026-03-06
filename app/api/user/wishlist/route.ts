import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongo/index";
import { ObjectId } from "mongodb";
import { Trip } from "@/lib/mongo/trips";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await currentUser();
        const wishlistIds = Array.isArray(user?.publicMetadata?.wishlist)
            ? (user!.publicMetadata!.wishlist as string[])
            : [];

        if (wishlistIds.length === 0) {
            return NextResponse.json({ trips: [] }, { status: 200 });
        }

        const client = await clientPromise;
        const db = client.db("travel_db");

        // Convert string IDs to ObjectId
        const objectIds = wishlistIds
            .filter((id) => id && id.length === 24) // Basic validation for 24-char hex string
            .map((id) => new ObjectId(id));

        if (objectIds.length === 0) {
            return NextResponse.json({ trips: [] }, { status: 200 });
        }

        const trips = await db.collection("trips").find({ _id: { $in: objectIds } }).toArray();

        const formattedTrips = trips.map((t) => ({
            ...t,
            _id: t._id.toString(),
        }));

        return NextResponse.json({ trips: formattedTrips }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching user wishlist full trips:", error);
        return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
    }
}
